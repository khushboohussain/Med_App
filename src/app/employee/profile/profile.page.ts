import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

  currentUrl: string;
  userType;

  constructor(private navController: NavController, private router: Router, private auth: AuthService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  ngOnInit() { }

  navigateDetails() {
    this.navController.navigateForward('/employee/profile/details');
  }

  navigateQualifications() {
    this.navController.navigateForward('/employee/profile/qualifications');
  }

  navigateStart() {
    // this.navController.navigateRoot("/start");
    this.auth.logout().then(res => {
      localStorage.clear();
      this.navController.navigateRoot('/start');
    });
  }

}
