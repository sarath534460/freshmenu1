import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @ViewChild('stp') stp!: ElementRef;
  datain: any;
  act: any;
  totalPrice: any;
  showaddress:boolean=true
  showpayment:boolean=false;
  validater:boolean=false
  
  buttons = [
    { clicked: false, paymenttype:"Cash",color: '#fff' },
    { clicked: false, paymenttype:"Phone Pay" ,color: '#fff' },
    { clicked: false, paymenttype:"Netbanking" ,color: '#fff' },
    { clicked: false, paymenttype:"Cards",color: '#fff' }
  ];

  lastClickedIndex: number | null = null;
  http: HttpClient;
  deliverydetails: any;
  result: any;
  token: any
  n:any
  constructor(act:ActivatedRoute,http:HttpClient){
    this.http=http
    this.act=act
    this.showaddress=true
    this.showpayment=false
    this.token=  localStorage.getItem('token')
    let decodedToken = jwtDecode(this.token);
    

    let headers=new HttpHeaders({'Authorization':  this.token})

    // http.get('http://localhost:48/getusernameforcheckout',{headers}).subscribe((jh:any)=>{
    //   console.log(jh)
    //  this.result=jh.data
   
    
    // })
  }

  ngOnInit(){
    // this.act.params.subscribe((data:any)=>{
    // let d=JSON.parse(data.k)
    // this.datain=d
    // console.log(d,"from checkout")
    // })

    this.act.params.subscribe((data:any)=>{
      try{
         let d=JSON.parse(data.k)
         this.datain=d
         console.log(this.datain)
      
        this.calculateTotalPrice()

      }
      catch(g){
       console.log(g)
      }  
      })

  }


  calculateTotalPrice(){
    this.totalPrice = this.datain.reduce((acc:any, item:any) => acc + item.totalprice, 0);

  }

  deliveryaddress(k:any){

    if(k.invalid){
      this.validater=true
    }
    else{
    this.deliverydetails=k.value
    this.showaddress=false
    this.showpayment=true

   

   
   
    // setTimeout(() => {
    //   if (this.stp) {
    //     const contentHeight = this.stp.nativeElement.scrollHeight;
    //     this.stp.nativeElement.style.height = `${contentHeight}px`;
    //   }
    // }, 0); // Use a timeout to ensure the DOM update has taken place

    }

  }

  changeColor(index: number) {
    if (this.lastClickedIndex !== null) {
      // Revert the previously clicked button to its original state
      this.buttons[this.lastClickedIndex].clicked = false;
    }
    // Set the newly clicked button's state
    this.buttons[index].clicked = true;
    // Update the last clicked button index
    this.lastClickedIndex = index;
  }


  placeorder(){
    Swal.fire({
      title: 'Order Confirmed!',
      text: 'Your order has been successfully placed.',
      icon: 'success',
      confirmButtonText: 'OK',
      cancelButtonText: 'No, cancel!',
    }).then((result)=>{
      if(result.isConfirmed){

        // this.http.post('http://localhost:47/updatecartcheckout',{responseType:"text"}).subscribe((jh:any)=>{    
        // })
        const timestamp = new Date().getTime().toString();
        const randomNum = Math.floor(Math.random() * 1000000);
        let orderid= 'ORDER-' + timestamp + '-' + randomNum;

         this. token=localStorage.getItem('token')
       let headers= new HttpHeaders({'Authorization': this.token})
    
        let a={objt1:this.deliverydetails,objt2:orderid,objt3:this.datain}
    
        this.http.post('http://localhost:48/orders',a,{headers}).subscribe((jh:any)=>{
          console.log(jh)
        })

        window.location.href=`http://localhost:4200`
      }
      else if (result.isDismissed) {
        // Handle cancellation logic here
        // this.http.post('http://localhost:47/updatecartcheckout',{responseType:"text"}).subscribe((jh:any)=>{    
        // })
        const timestamp = new Date().getTime().toString();
        const randomNum = Math.floor(Math.random() * 1000000);
        let orderid= 'ORDER-' + timestamp + '-' + randomNum;
         this.token=localStorage.getItem('token')

       let headers= new HttpHeaders({'Authorization':  this.token})
    
        let a={objt1:this.deliverydetails,objt2:orderid,objt3:this.datain}
    
        this.http.post('http://localhost:48/orders',a,{headers}).subscribe((jh:any)=>{
          console.log(jh)
        })

        window.location.href=`http://localhost:4200`
       
      }
    })
  }
}

  

