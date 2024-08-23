import {ChangeDetectorRef, Component,Input, ViewChild } from '@angular/core';
import { AuthServiceService } from '../auth.service.service';
import { HomeComponent } from '../home/home.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { repeat } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-cart',
  templateUrl: './side-cart.component.html',
  styleUrls: ['./side-cart.component.css']
})
export class SideCartComponent {

  @Input() showCart: boolean = false;
  @ViewChild('rf') rf!:HomeComponent
  k:number=79
  gh:any
  carts:any[]=[];
  totalitems:any;
  totalPrice:number=0
  yu:number=0
  categoryname: any;
  http: any;
  router: any;
  token:any;
  // Populate this array with cart items
  
  constructor(auth:AuthServiceService, private cdr: ChangeDetectorRef,http:HttpClient,router:Router) {
    this.gh=auth
    console.log(this.showCart)
    this.http=http
    this.router=router
    this.token=localStorage.getItem('token');

    let headers=new HttpHeaders({'Authorization':this.token})

    this.http.get('http://localhost:48/getitemsforsidecart',{headers}).subscribe((jh:any)=>{   
      if(jh.data==undefined||null){

      } 
      
      else{
      this.carts=jh.data
      this.calculateTotalPrice();
      this.totalitems=this.carts.length
      }
    })
    
  }

  addItem() {
   
  
     let [item,categoryname]= this.gh.getdata()
        console.log(item)
        this.showCart = true;
       //  this.carts.push(this.gh.getdata())
         item.categoryname=categoryname
         try{
         this.carts.push(item)
         }
         catch(e){
           console.log(e)
         }
        console.log(item)
    
    
        // this.categoryname=categoryname
     this.totalitems=this.carts.length
     this.calculateTotalPrice();
     this.token=localStorage.getItem('token');
     let headers=new HttpHeaders({'Authorization':this.token})
     this.http.post('http://localhost:48/addtocart',{item},{headers}).subscribe((jh:any)=>{    
       
     })
     
    //  this.http.get('http://localhost:48/getitemsforsidecart',{headers}).subscribe((jh:any)=>{    
    //    this.carts=jh.data
    //  })
     
    //  this.cdr.detectChanges(); // Trigger change detection
     
  }
     


    descr(a:any,b:any){
      //this method called from home component when the quantity zero to close 
      this.carts=this.carts.filter(y=>y.quantity>0)
      this.totalitems=this.carts.length
      if(this.totalitems==0){
        this.showCart=false
      }
      this.carts.forEach(y=>{//for changing the descrement values in screen when came the array from database
        if(y.itemname==a.itemname&&y.quantity==a.quantity){

          if(this.totalitems==0){
            this.showCart=false
          }
        }
        else if(y.itemname==a.itemname&&y.quantity!=a.quantity){//for changing the descrement values in screen when came the array from database
          y.quantity--
          y.totalprice=y.price*y.quantity
          
          this.calculateTotalPrice()
          this.carts=this.carts.filter(y=>y.quantity>0)
          this.totalitems=this.carts.length
          console.log(this.carts)
          if(this.totalitems==0){
            this.showCart=false

          }
        }
      })

      this.calculateTotalPrice();
    }

   
    in(r:any){
      console.log(r)
      console.log(r.categoryname,"from sidecart")
      this.gh.tochangeincfrsidetohome(r)
      //  this.gh.incfromsidetoprod(r)
      this.carts.forEach(y=>{
          if(r.itemname==y.itemname){
            y.quantity++
            this.calculateTotalPrice();
            y.totalprice=y.quantity*y.price
            let cat={categ:r.categoryname}
           let payload={y,cat}
           
         this.token=localStorage.getItem('token');
           
         let headers=new HttpHeaders({'Authorization':this.token})
           this.http.post('http://localhost:48/incfromside',payload,{headers}).subscribe((jh:any)=>{    
           })
          }
       })
     this.calculateTotalPrice();// to change the total price in the cart when inc
    }


    de(o:any){
      this.gh.tochangedescfrsidetohome(o)
      this.carts.forEach(y=>{
        if(o.itemname==y.itemname){
          y.quantity--
          y.totalprice=y.quantity*y.price
         
          if(y.quantity==0){
            y.isAdded=false
            y.totalprice=y.price
            this.carts=this.carts.filter(u=>u.quantity>0)
            this.totalitems=this.carts.length
            if(this.totalitems==0){
             this.closecart()
              //
            }
          }
          
          let cat={categ:o.categoryname}
          let payload={y,cat}
          
      this.token=localStorage.getItem('token');

      let headers=new HttpHeaders({'Authorization':this.token})
          this.http.post('http://localhost:48/descfromside',payload,{headers}).pipe(repeat(20)).subscribe((jh:any)=>{    
          })

        }

     })
     this.calculateTotalPrice();// to change the total price in the cart when desc
     
    }
    
    
    calculateTotalPrice(){
      this.totalPrice = this.carts.reduce((acc, item) => acc + item.totalprice, 0);

    }

   closecart(){
    this.showCart=false
   }
  
   placeorder(){
     let data=JSON.stringify(this.carts)
     this.router.navigate(['/checkout',data,this.totalPrice])
   }
                          //method called from homecomp
   inccart(a:any,b:any){//for changing the increment values in screen when came the array from database
    console.log(a)
      this.carts.forEach(y=>{
        if(y.itemname==a.itemname&&y.quantity==a.quantity){
         
        }
        else if(y.itemname==a.itemname&&y.quantity!=a.quantity){

          y.quantity++
          y.totalprice=y.price*y.quantity
          this.calculateTotalPrice()
        }
      })
   }

   inccartfromprod(a:any){//for changing the increment values in screen when came the array from database
    console.log(a)
      this.carts.forEach(y=>{
        if(y.itemname==a.itemname&&y.quantity==a.quantity){
         
        }
        else if(y.itemname==a.itemname&&y.quantity!=a.quantity){

          y.quantity++
          y.totalprice=y.price*y.quantity
          this.calculateTotalPrice()
        }
      })
   }



   fromprodadditem(k:any){
    this.carts.push(k)
   }
}
