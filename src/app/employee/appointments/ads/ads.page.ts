import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { map, take } from 'rxjs/operators';
import * as haversine from 'haversine';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.page.html',
  styleUrls: ['./ads.page.scss'],
})
export class AdsPage implements OnInit {

  getEmployeedata;
  allAds;
  jobTitle: '';
  qualification = [];
  // RETTUNGSSANITAETER
  otherQualData = [];
  simpleQualData = [];
  adData = [];

  step2 = [];

  constructor(private navController: NavController, private api: ApiService, private helper: HelperService) { }



  ngOnInit() {

    let x = [];
    this.api.getPersonalQualification().subscribe((res: any) => {
      this.qualification = res.data;
      console.log('own qualification', localStorage.getItem('qualifikation'));
      this.qualification.forEach((a, i) => {
        if (a.toLowerCase() === localStorage.getItem('qualifikation').toLowerCase()) {
          x = this.qualification.slice(i , this.qualification.length);
          console.log(x);
          return;
        }
      });
      // console.log('Accordingly ', x);
    });
    // this.getAdsData()

    this.api.getEmployeeData(localStorage.getItem('uid')).subscribe(res => {
      this.getEmployeedata = res;
      if (this.getEmployeedata.status === true) {
        this.getAllAds(x);
      }
    });

  }


  navigateAd(item) {
    console.log(item);
    localStorage.setItem('data', JSON.stringify(item));
    this.navController.navigateForward('employee/appointments/ads/ad');
  }

  getAllAds(x) {
    this.api.getAllAds().pipe(map((actions: any) =>
      actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }
      )
    )).subscribe((res: Array<any>) => {
      // console.log(res);

      this.allAds = res.filter(result => {
        return this.helper.filterAds(result, this.getEmployeedata, this.step2, x);
        // console.log(result);

      })
        .map(data => {
          return this.helper.filterAds(data, this.getEmployeedata, this.step2, x);
        });
    });
    console.log('simpel QualData', this.simpleQualData);

  }


}
