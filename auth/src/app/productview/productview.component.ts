import { Component,ViewChild,AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap, repeat } from 'rxjs';
import { SideCartComponent } from '../side-cart/side-cart.component';
import { AuthServiceService } from '../auth.service.service';
@Component({
  selector: 'app-productview',
  templateUrl: './productview.component.html',
  styleUrl: './productview.component.css'
})
export class ProductviewComponent {
  token:any
  actrout:any;
  datain:any;
  isButtonVisible:boolean=true
  a:any;
  addclick:boolean=false;
  isVisiblee:boolean=false;
  @ViewChild(HomeComponent) home!: HomeComponent;// Use `!` to assure TypeScript
  @ViewChild('cart') cart!: SideCartComponent;
  
  @Input() productData: any;
  
    
   http:any
   categoryname: any;
   arb: boolean=false;
   auth:any;
   newarray:any[]=[];

   constructor(actrout ?:ActivatedRoute,http?:HttpClient,auth?:AuthServiceService){
  
     if(actrout && http){
    this.http=http
    this.actrout=actrout
    this.auth=auth
     }
     else{
      this.defaultconstructor()
     }
  }

  defaultconstructor(){
 
  }
   
  ngOnInit(){
    this.actrout.params.subscribe((data:any)=>{
      
    let d=JSON.parse(data.i)
   // d.totalprice=d.price*d.quantity
    this.datain=d
    this.auth.datafromproduct=d
    this.isVisiblee=data.j
    this.categoryname=data.f
    console.log(this.categoryname,"productview")
    console.log(this.isVisiblee,"ott")
    })

  }


  desc(y:any){
    y.quantity--

    y.totalprice=y.quantity*y.price
    this.cart.calculateTotalPrice()


    if(y.quantity==0){
      this.isButtonVisible=true
    }
    this.cart.descr(y,8)

    this.cart.calculateTotalPrice()

    let cat={categ:this.categoryname}
    let payload={y,cat}

     this.token=localStorage.getItem('token');

     let headers=new HttpHeaders({'Authorization':this.token})

     this.http.post('http://localhost:48/descfromproduct',payload,{headers}).pipe(repeat(20)).subscribe((jh:any)=>{
 
              
     })
  }

  inc(y:any){
    y.quantity++
    y.totalprice=y.quantity*y.price
    this.cart.calculateTotalPrice()
    this.cart.showCart=true
    this.cart.inccartfromprod(y)
    let cat={categ:this.categoryname}
    let payload={y,cat}
    this.token=localStorage.getItem('token');
    let headers=new HttpHeaders({'Authorization':this.token})
    this.http.post('http://localhost:48/incfromproduct',payload,{headers}).pipe(repeat(20)).subscribe((jh:any)=>{    
    })
  }

  add(item:any){
    this.newarray.push(item)
    console.log(this.newarray)
    this.cart.showCart=true
    item.totalprice=item.price
    console.log(item)
   // this.datain.quantity++
    this.cart.fromprodadditem(item)
   this.isButtonVisible=false
   this.datain.quantity++

   this.token=localStorage.getItem('token');
   let headers=new HttpHeaders({'Authorization':this.token})
   this.http.post('http://localhost:48/addtocart',{item},{headers}).subscribe((jh:any)=>{    
     
   })


  }

  updateprodfroside(p:any,productitem:any){
   try{
    console.log(p)
    console.log(productitem)
    console.log(this.newarray)
    const exists = this.newarray.some((obj:any) => obj.itemname==p.itemname);
    console.log(exists)

   if(exists){
    
   }
   else if(p.itemname==productitem.itemname){
      productitem.quantity++
   }


  }
  catch(e){

  }
  }

  descprodfroside(p:any,productitem:any){
    try{
    console.log(p)
    console.log(productitem)
    const exists = this.newarray.some((obj:any) => obj.itemname==p.itemname);
    if(exists){  
    }
    else if(p.itemname==productitem.itemname){
      productitem.quantity--
    }
  }
  catch(e){
  }
  }

}
