import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  AdData;
  feeType: string;
  license: string;
  apply = [];
  getEmployeeData;
  employeeName;
  type = '';
  step2: any = [];
  qualification;
  ApplyFor: string;
  otherData: any = [];
  visible: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(public actionSheetController: ActionSheetController, private api: ApiService, private toastController: ToastController, private navController: NavController, private route: ActivatedRoute) { }


  ngOnInit() {
    this.otherData = JSON.parse(localStorage.getItem('otherData'));
    this.route.params.subscribe(res => {
      if (res.type) {
        this.type = res.type;
      }
    });
    // console.log('other data is ', this.otherData);

    this.getAds();
    this.GetEmployeeData();
  }

  getAds() {
    this.AdData = JSON.parse(localStorage.getItem('data'));
    // console.log('detail', this.AdData);
    if (this.otherData !== null) {
      this.visible = true;
      this.qualification = this.otherData.qualification;
      if (this.otherData.wageType) {
        if (this.otherData.wageType === 'DAILY') {
          this.feeType = 'Tag';
        } else {
          this.feeType = 'Stunde';
        }
      } else {
        if (this.AdData.wageType === 'DAILY') {
          this.feeType = 'Tag';
        } else {
          this.feeType = 'Stunde';
        }
      }
      // if (this.otherData.drivingLicence === 'B') {
      //   this.license = 'B';
      // } else if (this.otherData.drivingLicence === 'BE') {
      //   this.license = 'BE';
      // } else if (this.otherData.drivingLicence === 'NO') {
      //   this.license = 'Es wird kein Führerschein benötigt.';
      // } else {
      //   this.license = 'Ein Führerschein ist vorteilhaft, aber nicht notwendig.';
      // }
    } else { // ‏matching data
      this.visible = false;
      if (this.AdData.matchingQualification.qualification) {
        // console.log('if working');
        this.qualification = this.AdData.matchingQualification.qualification;
      } else {
        // console.log('else working');
        this.qualification = this.AdData.qualification;
      }

      if (this.AdData.matchingQualification.wageType) {
        if (this.AdData.matchingQualification.wageType === 'DAILY') {
          this.feeType = 'Tag';
        } else {
          this.feeType = 'Stunde';
        }
      } else {
        if (this.AdData.wageType === 'DAILY') {
          this.feeType = 'Tag';
        } else {
          this.feeType = 'Stunde';
        }
      }
    }

  } // end of ngOnInIt

  GetEmployeeData() {
    this.api.getEmployeeData(localStorage.getItem('uid')).subscribe(res => {
      this.getEmployeeData = res;
      this.employeeName = (this.getEmployeeData.vorname + ' ' + this.getEmployeeData.nachname);
      // console.log(this.employeeName)
    });
  }

  updateAds() {
    //   if(this.AdData.apply=[]){
    //   this.AdData.apply = [{'uid':localStorage.getItem('uid'), 'name':this.employeeName}];
    //   this.api.updateAds(this.AdData.id, this.AdData)
    //   .then(after => {

    //   });
    // }
    this.AdData.apply.push(
      {
        uid: localStorage.getItem('uid'),
        // tslint:disable-next-line: max-line-length
        applyFor: this.AdData.matchingQualification.qualification ? this.AdData.matchingQualification.qualification : this.AdData.matchingQualification,
        name: this.employeeName
      }
    );
    // console.log(this.AdData);
    // debugger;
    this.api.updateAds(this.AdData.id, this.AdData)
      .then(after => {
        if (this.type === 'notification') {
          let x = JSON.parse(localStorage.getItem('notification'));
          this.api.deleteNotification(x.did).then(goto => {
            this.navController.navigateRoot('/employee/appointments');
          });
        }
      });

  }
  isApply() {
    if (this.AdData.apply.map(data => data.uid).indexOf(localStorage.getItem('uid')) > -1) {
      return true;
    } else if (this.AdData.requiredEmployees === this.AdData.confirmEmployee.length) {
      return true;
    } else if (this.AdData.confirmEmployee.map(data => data.uid).indexOf(localStorage.getItem('uid')) > -1) {
      return true;
    } else {
      return false;
    }
  }
  async sendApplication() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Möchten Sie sich verbindlich für diese Stelle bewerben?',
      buttons: [{
        text: 'Verbindliche Bewerbung abschicken',
        handler: () => {
          this.updateAds();
          this.navController.navigateBack('/employee/appointments');
          this.confirmation('Sie haben sich erfolgreich beworben.');
        }
      }, {
        text: 'Abbrechen',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();
  }

  async confirmation(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getLisence(val) {
    if (val === 'BENEFICIAL') {
      return 'Ein Führerschein ist vorteilhaft, aber nicht notwendig.';
    } else if (val === 'NO') {
      return 'Es wird kein Führerschein benötigt.';
    } else {
      return val;
    }
  }
}


