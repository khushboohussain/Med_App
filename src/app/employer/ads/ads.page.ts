import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-ads',
  templateUrl: 'ads.page.html',
  styleUrls: ['ads.page.scss']
})
export class AdsPage {

  currentUrl: string;
  userType;
  getAds: any;
  endStartDate = [];

  constructor(private navController: NavController,
    private helper: HelperService, private router: Router, private api: ApiService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {

    localStorage.removeItem('AdsData');
    localStorage.removeItem('AdId');
    localStorage.removeItem('confirm');
    localStorage.removeItem('appliedId');
    localStorage.removeItem('adDetail');

    localStorage.removeItem('EmployeeData');
    localStorage.removeItem('empData');
    localStorage.removeItem('empId');
    localStorage.removeItem('actionController');
    localStorage.removeItem('continuoueCheck');
    localStorage.removeItem('days');
    // console.log(localStorage.getItem('uid'))
    this.api.getEmployeerAds(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        // console.log(did);
        return { did, ...data };
      })))
      .subscribe((res: any) => {
        this.getAds = res;
        // console.log('total ads \n', res);
        // console.log(this.getAds.length);
        // working on date
        for (let i = 0; i < this.getAds.length; i++) {
          // console.log(i + ' ', this.getAds[i].startDate + ' ' + this.getAds[i].endDate);

          if (this.getAds[i].startDate === this.getAds[i].endDate) {
            this.endStartDate[i] = this.getAds[i].startDate;
          } else {

            this.endStartDate[i] = this.getAds[i].startDate + ' - ' + this.getAds[i].endDate;
          }
        }
        // console.log(this.endStartDate);

      }, err => {
        console.log(err.message);
      });




  } // end of NgOnInIt

  navigateAd(data) {
    // console.log(data);
    // console.log('docID is ', data.did);
    localStorage.setItem('AdId', data.id);
    localStorage.setItem('adDetail', JSON.stringify(data));
    // this.helper.setAdDetails(data);
    this.navController.navigateForward('/employer/ads/ad');

  }

  // check payment method is integrated or not
  navigateCreateAd() {
    /*  if (checkPayment === true) {
       this.navController.navigateForward('/employer/ads/create/step1');
     } else {
     }
     */
    this.helper.presentToast('confirm Payment first!');
    this.navController.navigateForward('/employer/ads/create/step1');


  }

}
