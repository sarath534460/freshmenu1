import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth.service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
   checklogin:boolean=false;
   id:any;
   http: HttpClient;
   router: Router;
   auth:any;
  showotp: boolean=true;
  mobilecame: any;
  otp: boolean=false;
  validater: boolean=false;

  username: any;
  token: any;


 
 constructor(k:ActivatedRoute,http:HttpClient,router:Router,auth:AuthServiceService){
  this.auth=auth;
  this.http=http
  this.router=router
  k.params.subscribe(params => {
     this.id = params['u']; // 'id' is the name of the route parameter
    console.log(this.id);
  });
}
 


register(u:any,b:any){
  if(b.invalid){
   this.validater=true
  }
  else{
console.log(u)

b.reset();
this.validater=false
this.username=u.fname

this.http.post('http://localhost:48/register',u,{responseType:"text"}).subscribe((jh:any)=>{   
 let s= JSON.parse(jh)
  alert(s.message)
})

  }
}



login(l:any,b:any){
  
  
 this. mobilecame=l.no
  this.http.post('http://localhost:48/login',l,{responseType:"text"}).subscribe((jh:any)=>{   
    let s= JSON.parse(jh)
    
     if(s.show=="dontshow"){
      alert(s.message)
      this.showotp=true;
      this.otp=false;
     }
     else{
  
      this.showotp=false;
      this.otp=true;
     }


        //  if(s.k==true){
        //  this.checklogin=true
        //  console.log(this.checklogin)
        //  console.log(s.token,"tokens")
        //  localStorage.setItem('token',s.token)
        
        //  this.auth.loginchecking=s.k
        //  this.router.navigate(['/'])
         
        //  }

        //  else{
        //   this.checklogin=false
        //   console.log(this.checklogin,"fromcheckloh")
        //   this.auth.loginchecking=false;
        //   console.log(this.auth.loginchecking)
        //   this.router.navigate(['/'])
        //  }
     
   })

  

}

otplogin(y:any){

  this.http.post('http://localhost:48/verifyotp',{mobile:this.mobilecame,otp:y,k:this.username},{responseType:"text"}).subscribe((jh:any)=>{  

    let s= JSON.parse(jh)
     alert(s.message)
          
       if(s.k==true){
         this.checklogin=true
         console.log(this.checklogin)
         console.log(s.token,"tokens")
         localStorage.setItem('token',s.token)
        
         this.auth.loginchecking=s.k
         this.router.navigate(['/'])
         
         }

         else{
          this.checklogin=false
          console.log(this.checklogin,"fromcheckloh")
          this.auth.loginchecking=false;
          console.log(this.auth.loginchecking)
          this.router.navigate(['/'])
         }

   })


}


gmailbutton(){
    window.location.href = 'http://localhost:48/auth/google';
   

}


}
