import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavComponent } from '../../common/nav/nav.component';
import { ManageEmpComponent } from "../manage-emp/manage-emp.component";

@Component({
  selector: 'app-view-all-employee',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, NavComponent, ManageEmpComponent],
  templateUrl: './view-all-employee.component.html',
  styleUrl: './view-all-employee.component.css'
})
export class ViewAllEmployeeComponent {

  public employeeList: any;



  constructor(private http: HttpClient) {
    this.loadEmployeTable();
  }

  getDepartmentNames(departmentList:any[]):string{
    return departmentList.map(dept=>dept.name).join(', ');
  }

  loadEmployeTable() {
    const headers = new HttpHeaders({
      'Content-Type':'Application/json',
      'Authorization':'Basic c2FtYW46MTIzNA=='
    });
    this.http.get("http://localhost:8080/emp-controller/get-all",{headers}).subscribe(res => {
      this.employeeList = res;
      console.log(res);
    })
  }
  deleteEmploye(employe: any) {
    const headers = new HttpHeaders({
      'Content-Type':'Application/json',
      'Authorization':'Basic c2FtYW46MTIzNA=='
    });

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.delete(`http://localhost:8080/emp-controller/delete-emp/${employe.id}`, { responseType: 'text',headers }).subscribe(res => {
          this.loadEmployeTable()
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          console.log(res);

        })
        console.log(employe);


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }

  public selectedEmployee: any = {
    "id": null,
    "firstName": null,
    "lastName": null,
    "email": null,
    "departmentId": null,
    "roleId": null
  };

  updateEmploye(employe: any) {
    if(employe!=null){
      this.selectedEmployee = employe;
    }
    console.log(employe);
  }

  saveUpdateEmployee(){
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
        this.http.put("http://localhost:8080/emp-controller/update-employee", this.selectedEmployee).subscribe(res => {
          console.log("updated!");
        })
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
}
