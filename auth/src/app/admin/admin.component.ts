import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  file:any;
  p:any;
  http:any;

   constructor(htt:HttpClient){
    this.http=htt
   }

  onSubmit(g:any){
   console.log(g)
  this.p=g

  let formdata=new FormData();
  formdata.append('hjk',this.file);
  formdata.append('data',JSON.stringify(this.p))
  console.log(formdata)
  
  this.http.post('http://localhost:47/sendcategory',formdata,{responseType:"text"}).subscribe((jh:any,err:any)=>{
   console.log(jh)
  })

  }

  
  imagfile(e:any){
     let h:File= e.target.files[0]
     this.file=h
   
  }
   

}
