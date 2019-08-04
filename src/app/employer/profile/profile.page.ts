import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentUrl: string;

  constructor(private navController: NavController, private router: Router, private auth: AuthService, private api: ApiService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  ngOnInit() {


  }


  navigateDetails() {
    this.navController.navigateForward('/employer/profile/details');
  }

  navigatePaymentMethods() {
    this.navController.navigateForward('/employer/profile/payment-methods');
  }

  navigateStart() {
    // if (confirm('Are you sure to logout!')) {
    // }
    this.auth.logout().then(res => {
      localStorage.clear();
      this.navController.navigateRoot('/start');
    });
    // this.navController.navigateRoot("/employer/profile");
  }


}
