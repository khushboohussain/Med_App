import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  currentUrl: string;
  userType;

  constructor(private navController: NavController, private router: Router, public auth: AuthService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }


  ngOnInit() {
  }


  navigateEmployer() {
    this.navController.navigateForward('admin/settings/qualification');
  }

  logout() {
    this.auth.logout().then(res => {
      this.navController.navigateRoot('/start');
    });
  }



}
