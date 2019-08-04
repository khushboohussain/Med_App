import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-applications',
  templateUrl: './applications.page.html',
  styleUrls: ['./applications.page.scss'],
})
export class ApplicationsPage implements OnInit {

  getAllAds: any;
  data = [];
  qualifications = [];

  constructor(private navController: NavController, private api: ApiService, private helper: HelperService) { }

  ngOnInit() {
    localStorage.removeItem('appliedId');
    localStorage.removeItem('confirm');

    this.getAllAds = JSON.parse(localStorage.getItem('adDetail'));
    // console.log(this.getAllAds);

    if (this.getAllAds.apply.length > 0) {
      let apply = this.getAllAds.apply;

      let qualifications = apply.map(data => {return data.applyFor;}).filter((item, i, ar) => ar.indexOf(item) === i);


      const grouped = this.helper.groupBy(apply, data => data.applyFor);

      qualifications.forEach(a =>{

        this.data.push({
          category: a,
          apply: grouped.get(a)
        })

        // console.log(grouped.get(a));
      });

      // console.log(this.data);

      if (this.getAllAds.step2) {
        for (let i = 0; i < this.getAllAds.step2.length; i++) {
          this.qualifications.push(this.getAllAds.step2[i].qualification);
        }
      } else {
        this.qualifications = this.getAllAds.qualification;
      }

    } else {
      alert('you do not have any application!');
      this.navController.navigateForward('/employer/ads');
    }

  }

  navigateApplication(data) {
    // console.log('id is ', data.uid);
    localStorage.setItem('appliedId', data.uid);
    this.navController.navigateForward('/employer/ads/ad/applications/application');
  }

  navigateBack() {
    this.navController.pop();
  }


}
