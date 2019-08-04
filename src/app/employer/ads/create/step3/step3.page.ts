import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.page.html',
  styleUrls: ['./step3.page.scss'],
})
export class Step3Page implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  navigateHome() {
    // console.log(localStorage);
    localStorage.removeItem('AdsData');
    localStorage.removeItem('actionController');
    localStorage.removeItem('continuoueCheck');
    localStorage.removeItem('days');

    this.navController.navigateRoot('/employer/ads');
  }


}
