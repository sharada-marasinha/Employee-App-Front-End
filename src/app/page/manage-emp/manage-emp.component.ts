import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavComponent } from '../../common/nav/nav.component';

@Component({
  selector: 'app-manage-emp',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule,NavComponent],
  templateUrl: './manage-emp.component.html',
  styleUrl: './manage-emp.component.css'
})
export class ManageEmpComponent {



  constructor(private http:HttpClient){}

  public empId="";

  public employeeObj ={
    id:this.empId,
    firstName:"",
    lastName:"",
    email:"",
    departmentList:[
      {
        name:"",
        description:"",
        employee:{
          id:this.empId
        }
      }
    ],
    role:{
      name:"",
      descrption:""
    }
  }

  addEmployee(){
    console.log(this.employeeObj);

    this.employeeObj.id=this.empId;
    this.employeeObj.departmentList[0].employee.id=this.empId;

    const headers = new HttpHeaders({
      'Content-Type':'Application/json',
      'Authorization':'Basic c2FtYW46MTIzNA=='
    });

    this.http.post("http://localhost:8080/emp-controller/add-employee",this.employeeObj,{headers}).subscribe(
      (data) =>{
        Swal.fire({
          title: "Employee added!",
          text: "You clicked the button!",
          icon: "success"
        });

      },(error)=>{
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: error.error?.massage||"There was an issue adding the employee!",
          icon: "error"
        });

      }
    )


  }
}
