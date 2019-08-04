import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.page.html',
  styleUrls: ['./ad.page.scss'],
})
export class AdPage implements OnInit {

  AdData;
  qualification = [];
  otherQualification = [];
  location;
  type = '';
  step2;
  endStartDate;

  constructor(private navController: NavController, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('otherQual');
    localStorage.removeItem('qual');
    localStorage.removeItem('qualData');

    this.getAds();
    this.route.params.subscribe(res => {
      if (res.type) {
        this.type = res.type;
      }
    });
  }

  getAds() {
    this.AdData = JSON.parse(localStorage.getItem('data'));
    console.log(this.AdData);
    if (this.AdData.startDate === this.AdData.endDate) {
      this.endStartDate = this.AdData.startDate;
    } else {
      this.endStartDate = this.AdData.startDate + ' - ' + this.AdData.endDate;
      // console.log(this.endStartDate)
    }
    // console.log('ad.page', this.AdData);
    if (this.AdData.condition3 === true) {
      this.step2 = this.AdData.step2;
      for (let index = 0; index < this.step2.length; index++) {
        this.qualification[index] = this.step2[index].qualification;
        if (this.step2[index].otherQualification.length > -1) {

          for (let xc = 0; xc < this.step2[index].otherQualification.length; xc++) {
            this.otherQualification[xc] = this.step2[index].otherQualification[xc].qualification;
          }
        }
      }
      // console.log(this.otherQualification);


    } else {
      this.qualification.push(this.AdData.qualification);

      if (this.AdData.otherQualification.length > -1) {
        for (let xc = 0; xc < this.AdData.otherQualification.length; xc++) {
          this.otherQualification[xc] = this.AdData.otherQualification[xc].qualification;
        }
      }
      // console.log(this.otherQualification);

    }

  }

  navigateAdDetails() {
    // console.log('data is ', data);
    // console.log('index is ', index);
    // localStorage.removeItem('qualData');
    localStorage.removeItem('otherQual');

    // localStorage.setItem('otherQual', JSON.stringify(index));
    // localStorage.setItem('qualData', data);
    // localStorage.removeItem('data');
    // localStorage.setItem('data', JSON.stringify(this.AdData));

    if (this.type !== '') {
      this.router.navigate(['employee/appointments/ads/ad/details', {
        type: this.type
      }]);
    } else {
      this.navController.navigateForward('employee/appointments/ads/ad/details');
    }
  }


  navigateAdDetails2(qual: number, data: string, otherQual: number) {
    // console.log('qual is ', qual);
    // console.log('data is ', data);
    // console.log('OtherQual is ', otherQual);
    localStorage.removeItem('qual');
    localStorage.removeItem('otherQual');

    localStorage.setItem('qual', JSON.stringify(qual));
    localStorage.setItem('otherQual', JSON.stringify(otherQual));
    // localStorage.setItem('qualData', data);

    if (this.type !== '') {
      this.router.navigate(['employee/appointments/ads/ad/details', {
        type: this.type
      }]);
    } else {
      this.navController.navigateForward('employee/appointments/ads/ad/details');
    }

  }

}
