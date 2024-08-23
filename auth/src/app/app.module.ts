import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  
} from 'angularx-social-login';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SideCartComponent } from './side-cart/side-cart.component';
import { AuthServiceService } from './auth.service.service';
import { ProductviewComponent } from './productview/productview.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfiledetailsComponent } from './profiledetails/profiledetails.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    SideCartComponent,
    ProductviewComponent,
    CheckoutComponent,
    ProfiledetailsComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule

  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '531034718992-lfmes1kimcslmc8u8nb2tg0kl8qbgu22.apps.googleusercontent.com'
            )
          },
         
         
      
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
