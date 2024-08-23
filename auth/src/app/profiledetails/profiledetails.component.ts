import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-profiledetails',
  templateUrl: './profiledetails.component.html',
  styleUrl: './profiledetails.component.css'
})
export class ProfiledetailsComponent {
  http: HttpClient;
  token: any
  d:any;
  

  constructor(http:HttpClient){
    this.token= localStorage.getItem('token')

     this.http=http
     let headers=new HttpHeaders({'Authorization':  this.token})

     http.get('http://localhost:48/getprofiledetails',{headers}).subscribe(u=>{
         console.log(u)
         this.d=u
     })
  }


}
