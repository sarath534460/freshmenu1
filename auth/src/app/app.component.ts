import { Component,OnInit, ViewChild } from '@angular/core';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  @ViewChild('cart') cart!: HomeComponent;
    
  constructor() { 
    
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:47/auth/google'; // Adjust the URL to your backend
  }

}
