import { Injectable } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ProductviewComponent } from './productview/productview.component';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
 pl:any
  category: any;
  datafromproduct:any
  loginchecking:any;
  arr: any[]=[] ;
  tws:any
  
  constructor() {

    console.log(this.loginchecking,"from the house of login")
  }
 
  senddata(k:any,category:any){
   this.pl=k
  
   this.category=category
   console.log("from auth",k)
   this.arr.push(k)
   console.log(this.arr)
  }

  getdata(){
  
  
    return [this.pl,this.category];
  }
 

  tochangeincfrsidetohome(p:any){
    console.log(p)
    let s=new HomeComponent()
    s.fromsidetoinc(p,this.tws,this.arr)

   
    
    let k= new ProductviewComponent()
    k.updateprodfroside(p,this.datafromproduct)
  }
 
  tochangedescfrsidetohome(s:any){
   
    let sp=new HomeComponent()
    sp.fromsidetodec(s,this.tws,this.arr)
    let k= new ProductviewComponent()
    k.descprodfroside(s,this.datafromproduct)
  }

//   incfromsidetoprod(u:any){
//     let k= new ProductviewComponent()
//     k.updateprodfroside(u)
//     }
}
