import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})
export class OrderhistoryComponent {
  a:any;
  http:any;
  token:any
  parray:any;
  show: boolean=true;
  showa: boolean=false;
  dataorder: any;
  router: Router;
  location: Location;
  totalprice: any;

  constructor(http:HttpClient,router:Router, location: Location){
  this.router=router
  this.http=http
  this.location = location;
  this.token=window.localStorage.getItem('token')
  let headers=new HttpHeaders({'Authorization':  this.token})

  this.http.get('http://localhost:48/getorders',{headers}).subscribe((jh:any)=>{  
     
  this.parray=jh.message.orders
   console.log(this.parray)
    
  })
   


  this.router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      if (event.restoredState) {
        this.show = true;
        this.showa = false;
      }
    }
  });



  }
  
  // ngOnInit() {
  //   // Detect navigation events
  
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationStart) {
  //       // Detect navigation start and handle the back button scenario
  //       if (event.restoredState) {
  //         this.show = true;
  //         this.showa = false;
  //       }
  //     } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
  //       // Handle navigation end, cancel, or error
  //       // This could be useful for additional handling or resetting
  //      this.show = false;
  //       this.showa = true;
  //     }
  //   });

  
  //}

  
  onOrderClick(y:any){
    this.dataorder=y
   this.totalprice= y.items.reduce((accumulator:any, item:any) => accumulator + item.totalprice, 0);
    console.log(y)
   this.show=false
   this.showa=true
  }

}
