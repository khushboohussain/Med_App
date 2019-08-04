import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.page.html',
  styleUrls: ['./confirmed.page.scss'],
})
export class ConfirmedPage implements OnInit {

  getAllAd: any;
  data = [];
  qualifications;

  constructor(private navController: NavController, private helper: HelperService) { }

  ngOnInit() {
    localStorage.removeItem('appliedId');

    this.getAllAd = JSON.parse(localStorage.getItem('adDetail'));
    // console.log('data', this.getAllAd);

    let confirm = this.getAllAd.confirmEmployee;
    console.log(confirm);
    let qualifications = confirm.map(data => { return data.applyFor; }).filter((item, i, ar) => ar.indexOf(item) === i);


    const grouped = this.helper.groupBy(confirm, data => data.applyFor);

    qualifications.forEach(a => {

      this.data.push({
        category: a,
        confirm: grouped.get(a)
      })

      // console.log(grouped.get(a));
    });

    // console.log(this.data);

    if (this.getAllAd.step2) {
      for (let i = 0; i < this.getAllAd.step2.length; i++) {
        this.qualifications.push(this.getAllAd.step2[i].qualification);
      }
    } else {
      this.qualifications = this.getAllAd.qualification;
    }
    // console.log('confirm employee', this.getAllAd.confirmEmployee);

    // this.data = this.getAllAd.confirmEmployee;
    // for (let index = 0; index < this.data.length; index++) {

    // }

  }

  navigateApplication(data) {
    // console.log('id is ', data.uid);
    localStorage.setItem('confirm', JSON.stringify(true));
    localStorage.setItem('appliedId', data.uid);
    this.navController.navigateForward('/employer/ads/ad/applications/application');
  }

}
