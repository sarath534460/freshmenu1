import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProductviewComponent } from './productview/productview.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfiledetailsComponent } from './profiledetails/profiledetails.component';

import { OrderhistoryComponent } from './orderhistory/orderhistory.component';



const routes: Routes = [{path:"",component:HomeComponent},
  {path:"login/:u",component:LoginComponent}, 
  {path:"admin",component:AdminComponent},
  {path:"orderhistory",component:OrderhistoryComponent},
  {path:"checkout/:k/:totalprice",component:CheckoutComponent},
  {path:"profiledetails",component:ProfiledetailsComponent},
  {path:"product/:i/:j/:f",component:ProductviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 




}
