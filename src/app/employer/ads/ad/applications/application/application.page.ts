import { Component, OnInit, NgZone } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.page.html',
  styleUrls: ['./application.page.scss'],
})
export class ApplicationPage implements OnInit {

  userDetail: any = {};
  // add: any = [];
  // val;
  // name: string;
  licenseType = '';
  otherQualifications: boolean;
  otherQual: any;
  isConfirmApp: boolean;
  adData;

  // tslint:disable-next-line: max-line-length
  constructor(public actionSheetController: ActionSheetController, private toastController: ToastController, private navController: NavController, public api: ApiService,
    private ngzone: NgZone, private helper: HelperService, private route: ActivatedRoute) { }

  ngOnInit() {
    // console.log(localStorage);
    // this.add = JSON.parse(localStorage.getItem('adDetail'));
    // console.log(this.add.apply);

    // const x = this.add.apply.findIndex(data => data.uid === localStorage.getItem('appliedId'));
    // if (x > -1) {
    //   this.val = x;
    //   console.log(this.val);
    // }




    this.api.getEmployeeData(localStorage.getItem('appliedId')).subscribe(res => {
      this.userDetail = res;
      this.otherQual = this.userDetail.qualification;
    }, err => {
      console.log('errors!', err.message);
    });

    this.route.params.subscribe(res => {
      if (res.type) {
        let x = JSON.parse(localStorage.getItem('notification'));
        // console.log(x);
        this.api.getAd(x.notificationId).subscribe((result: any) => {
          // console.log('value', result);


          let x = result.confirmEmployeeIds.findIndex(data => data.indexOf(localStorage.getItem('appliedId')) > -1);
          if (x > -1) {
            this.isConfirmApp = true;
          }
        });
      } else {
        let ad = JSON.parse(localStorage.getItem('adDetail'));
        this.api.getAd(ad.did)
          .subscribe((res: any) => {
            console.log(localStorage.getItem('appliedId'));
            let x = res.confirmEmployeeIds.findIndex(data => data.indexOf(localStorage.getItem('appliedId')) > -1);
            if (x > -1) {
              this.isConfirmApp = true;

            }
            this.adData = res;
          });
      }
    });


    if (this.userDetail.führerscheinklasse === 'NO') {
      this.licenseType = 'Es wird kein Führerschein benötigt';
    } else if (this.userDetail.führerscheinklasse === 'BENEFICIAL') {
      this.licenseType = 'Führerschein wäre vorteilhaft';
    } else if (this.userDetail.führerscheinklasse === 'B') {
      this.licenseType = 'Führerschein B vorteilhaft';
    } else {
      this.licenseType = 'Führerschein B1 vorteilhaft';
    }

    this.isConfirmApp = JSON.parse(localStorage.getItem('confirm'));

    if (this.otherQual !== '' || this.otherQual !== undefined) {
      this.otherQualifications = false;
    } else {
      this.otherQualifications = true;
    }

  }


  async answerOptions() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Geben Sie Ihrem Bewerber eine Rückmeldung.',
      buttons: [{
        text: 'Verbindliche Zusage abschicken',
        handler: () => {
          // Confirmation of application
          // let ad = JSON.parse(localStorage.getItem('adDetail'));
          let ad;
          ad = JSON.parse(localStorage.getItem('adDetail'));

          ad = this.adData;
          let index;
          const adIndex = ad.apply.findIndex(data => data.uid === localStorage.getItem('appliedId'));
          if (adIndex > -1) {
            index = adIndex;
          } else {
            return;
          }



          if (ad.confirmEmployee) {
            ad.confirmEmployee.push({
              name: ad.apply[index].name,
              // name: this.userDetail.vorname + ' ' + this.userDetail.nachname,
              applyFor: ad.apply[index].applyFor,
              uid: ad.apply[index].uid
            });
            ad.confirmEmployeeIds.push(localStorage.getItem('appliedId'));
          } else {
            ad.confirmEmployee = [];
            ad.confirmEmployeeIds = [];
            ad.confirmEmployee.push({
              name: ad.apply[index].name,
              // name: this.userDetail.vorname + ' ' + this.userDetail.nachname,
              applyFor: ad.apply[index].applyFor,
              uid: ad.apply[index].uid
            });
            ad.confirmEmployeeIds.push(localStorage.getItem('appliedId'));
          }

          const x = ad.apply.findIndex(data => data.uid === localStorage.getItem('appliedId'));
          if (x > -1) {
            ad.apply.splice(x, 1);
            delete ad.id;
            this.api.updateAds(localStorage.getItem('AdId'), ad).then(() => {
              this.helper.presentToast('Sie haben erfolgreich dem Bewerber eine Zusage gesendet.');

              // console.log('confirm Emp is ', ad);
              localStorage.setItem('adDetail', JSON.stringify(ad));
              // this.helper.setAdDetails(ad);

              this.navController.navigateRoot('employer/ads');
              // this.navController.navigateForward('/employer/ads/ad/applications');

              // this.navController.navigateBack('/employer/ads/ad/applications');
            });
          }

          // console.log('ad is ', ad);
        }


      }, {
        text: 'Verbindliche Absage abschicken',
        handler: () => {
          // Rejection of application
          let ad;
          ad = JSON.parse(localStorage.getItem('adDetail'));

          ad = this.adData;

          let index;
          const adIndex = ad.apply.findIndex(data => data.uid === localStorage.getItem('appliedId'));
          if (adIndex > -1) {
            index = adIndex;
          }
          if (ad.rejectedEmployee) {
            ad.rejectedEmployee.push({
              name: ad.apply[index].name,
              // name: this.userDetail.vorname + ' ' + this.userDetail.nachname,
              rejectFor: ad.apply[index].applyFor,
              uid: ad.apply[index].uid
            });

          } else {
            ad.rejectedEmployee = [];
            ad.rejectedEmployee.push({
              name: ad.apply[index].name,
              // name: this.userDetail.vorname + ' ' + this.userDetail.nachname,
              rejectFor: ad.apply[index].applyFor,
              uid: ad.apply[index].uid
            });
          }

          const x = ad.apply.findIndex(data => data.uid === localStorage.getItem('appliedId'));
          if (x > -1) {
            ad.apply.splice(x, 1);
            delete ad.id;
            this.api.updateAds(localStorage.getItem('AdId'), ad).then(() => {
              this.helper.presentToast('Rejected Employee!');
              // console.log('detail is ', ad);
              localStorage.setItem('adDetail', JSON.stringify(ad));
              // this.helper.setAdDetails(ad);
              this.navController.navigateRoot('employer/ads');
              // this.navController.navigateForward('/employer/ads/ad/applications');
              // this.navController.navigateBack('/employer/ads/ad/applications');
            });
          }

          // console.log('rejectedEmployee ad is ', ad);
        }
      }, {
        text: 'Abbrechen',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
  }



}
