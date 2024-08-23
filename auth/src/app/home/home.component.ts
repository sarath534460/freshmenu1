import { ChangeDetectorRef, Component,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SideCartComponent } from '../side-cart/side-cart.component';
import { AuthServiceService } from '../auth.service.service';
import { Router } from '@angular/router';
import { ProductviewComponent } from '../productview/productview.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
   test:boolean=true
   result:any
   a:any;
   testi:string="hello i am testing"
   arb: boolean = false;
   ar:any;
   totalitems:number=0
   @ViewChild('cart') cart!: SideCartComponent;
   @ViewChild('Pr') Pr!: ProductviewComponent;
   router:any;
   http: any;
   quantity=0;
   printlogin: any;
   jd:boolean=false
  
   token:any;
   cdr: any;
  totalitem: any;
 
   constructor(http ?:HttpClient, cdr ?: ChangeDetectorRef,auth ?:AuthServiceService,router ?:Router){
    if(http&&cdr&&auth&&router){
    this.router=router
    this.http=http
    this.ar=auth
    this.cdr=cdr
    try{
    if(this.cart.carts.length==undefined||this.cart.carts.length==null){

    }
    else{
    
   this.totalitem= this.cart.carts.length
    }
   }
   catch(e){

   }
   // this.printlogin= auth.loginchecking;
     if (typeof window !== 'undefined' && localStorage) {
      // Your logic here
      this.token= localStorage.getItem('token')
    }
     http.get('http://localhost:48/getcategory').subscribe((jh:any)=>{
       console.log(jh)
      this.result=jh
    
     
     })
     let headers=new HttpHeaders({'Authorization':  this.token})
   
     http.get('http://localhost:48/getitemlistofuser',{headers}).subscribe((jh:any)=>{
      try{

        setTimeout( ()=>{
       this.result.map((item:any )=> {
        item.items.forEach((y:any)=>{
          let match = jh.data.find((bItem:any) => bItem.itemname === y.itemname);
          console.log(match,"from match")
          if(match){
            y.quantity=match.quantity;

          }
          
          })
       })
    
       this.ar.tws=this.result;


    },1500)
  

    }
    catch(e){

    }
     })
   
    }

    else{
      this.defaultconstructor()
    }
  }
  
  
  defaultconstructor(){
     
  }

  
  addToCart(item:any,k:any){ // this is for sending to side cart and initillay also add quantity once 1
     item.totalprice=item.price
     item.quantity++
     console.log(item)
     this.cart.calculateTotalPrice()

     this.ar.senddata(item,k); //sending item objt to service method
     //item.isAdded=true;
     this.cart.addItem()  //calling the sidecart method
     this.arb = true;
     this.totalitems++
     
  }
   

  productpage(y:any,l:any){
  
    let yk=JSON.stringify(y)
    
    // this.Pr.fg(this.arb)
    this.router.navigate(['/product',yk,this.arb,l])
    
  }
  

  inc (l:any,categoryname:any){
  l.quantity++
  l.totalprice=l.quantity*l.price
  this.cart.calculateTotalPrice()
  let cat={categ:categoryname}
  this.cart.inccart(l,categoryname);//this method send to sidecart for the increment because in side cart its coming from database
  let payload={l,cat}
    let headers=new HttpHeaders({'connection':'Keep-Alive','Keep-Alive':'timeout=5,max=100','Authorization':  this.token})
   this.http.post('http://localhost:48/incfromhome',{payload},{headers}).subscribe((jh:any)=>{    
   })
   
  }


  desc(f:any,categoryname:any){
    f.quantity--;
     

    this.cart.descr(f,categoryname);//this is sending to sidecart for when it removes  the item becomes quantity less than one 1 
    this.cart.calculateTotalPrice()
      console.log("ljku")
     if(f.quantity<1){
       f.quantity=0
       //f.isAdded=false
       console.log(f.price,f.totalprice)
       this.cart.calculateTotalPrice()
     }
     
     if(f.quantity==0){
      f.totalprice=f.price
      this.cart.calculateTotalPrice()
     }
     else{
      f.totalprice=f.quantity*f.price
      this.cart.calculateTotalPrice()

     }

     let cat={categ:categoryname}
     let payload={f,cat}
     let headers=new HttpHeaders({'Authorization':  this.token})
     this.http.post('http://localhost:48/descfromhome',payload,{headers}).subscribe((jh:any)=>{    
     })
  }
 
 
  logout(){
    localStorage.removeItem('token')
    window.location.reload();
  }
  
  fromsidetoinc(d:any,j:any,arr:any){
   console.log(d)
   console.log(j)

  //  let z=this.ar.pk()
   console.log(arr)
   j.forEach((y:any)=>{
      y.items.forEach((x:any)=>{

        const exists = arr.some((obj:any) => obj.itemname==x.itemname);
         console.log(exists)
        
         if(x.itemname==d.itemname  && exists==true){
          
         }
        else if(x.itemname==d.itemname && exists==false){
          x.quantity++

         }
        
      })
   })

  }
  
  fromsidetodec(d:any,j:any,arr:any){
    console.log(d)
    console.log(j)
 
   //  let z=this.ar.pk()
    console.log(arr)
    j.forEach((y:any)=>{
       y.items.forEach((x:any)=>{
 
         const exists = arr.some((obj:any) => obj.itemname==x.itemname);
          console.log(exists)
         
          if(x.itemname==d.itemname  && exists==true){
           
          }
         else if(x.itemname==d.itemname && exists==false){
           x.quantity--

          }
         
       })
    })
  }

  cartclick(){
    this.cart.showCart = true;
  }
  
}
