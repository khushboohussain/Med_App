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
  qualification: string;
  otherQualification = [];
  location;
  type = '';
  step2;
  endStartDate;
  employeLicense: string;

  constructor(private navController: NavController, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.employeLicense = localStorage.getItem('drivingLicense');
    console.log('employee License ', this.employeLicense);
    localStorage.removeItem('otherData');

    this.getAds();
    this.route.params.subscribe(res => {
      if (res.type) {
        this.type = res.type;
      }
    });
  }

  getAds() {
    this.AdData = JSON.parse(localStorage.getItem('data'));
    console.log('whole record', this.AdData);
    console.log('Matching data', this.AdData.matchingQualification);
    let x = [];
    x = JSON.parse(localStorage.getItem('Qualifications'));
    console.log('old x is ', x);
    x.shift();
    console.log('new x is ', x);
    this.getMoreAds(x);
    if (this.AdData.matchingQualification.qualification) {
      this.qualification = this.AdData.matchingQualification.qualification;
    } else {
      this.qualification = this.AdData.matchingQualification;
    }
    if (this.AdData.startDate === this.AdData.endDate) {
      this.endStartDate = this.AdData.startDate;
      // console.log('if  working..', this.endStartDate);
    } else {
      this.endStartDate = this.AdData.startDate + ' - ' + this.AdData.endDate;
      // console.log('else working..', this.endStartDate);
    }
    // console.log('ad.page', this.AdData);

    // this.qualification.push(this.AdData.qualification);

    // if (this.AdData.otherQualification.length > -1) {
    //   for (let xc = 0; xc < this.AdData.otherQualification.length; xc++) {
    //     this.otherQualification[xc] = this.AdData.otherQualification[xc].qualification;
    //   }
    // }
  }
  getMoreAds(x: string[]) {
    if (x.length > 0) {
      if (this.AdData.condition3 === true) {
        this.step2 = this.AdData.step2;
        // for (const data of this.step2) {
        // }
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.step2.length; index++) {
          if (this.step2[index].drivingLicence === 'NO' || this.step2[index].drivingLicence === 'BENEFICIAL') {
            if (x.indexOf(this.step2[index].qualification) > -1) {
              if (this.qualification !== this.step2[index].qualification) {
                this.otherQualification.push(this.step2);
              }
            }

          } else {
            if ((x.indexOf(this.step2[index].qualification) > -1) && this.step2[index].drivingLicence === this.employeLicense) {
              if (this.qualification !== this.step2[index].qualification) {
                this.otherQualification.push(this.step2);
              }
            }
          }

          if (this.step2[index].otherQualification.length > 0) {
            // tslint:disable-next-line: prefer-for-of
            for (let xc = 0; xc < this.step2[index].otherQualification.length; xc++) {
              // tslint:disable-next-line: max-line-length
              if (this.step2[index].otherQualification[xc].drivingLicence === 'NO' || this.step2[index].otherQualification[xc].drivingLicence === 'BENEFICIAL') {
                if (x.indexOf(this.step2[index].otherQualification[xc].qualification) > -1) {
                  if (this.qualification !== this.step2[index].otherQualification[xc].qualification) {
                    this.otherQualification.push(this.step2[index].otherQualification[xc]);
                  }
                }
              } else {
                // tslint:disable-next-line: max-line-length
                if (x.indexOf(this.step2[index].otherQualification[xc].qualification) > -1 && this.step2[index].otherQualification[xc].drivingLicence === this.employeLicense) {
                  if (this.qualification !== this.step2[index].otherQualification[xc].qualification) {
                    this.otherQualification.push(this.step2[index].otherQualification[xc]);
                  }
                }

              }

            }
          }
        }
        // console.log('newd data 1', this.otherQualification);
      } else {
        if (this.AdData.drivingLicence === 'BENEFICIAL' || this.AdData.drivingLicence === 'NO') {
          if (x.indexOf(this.AdData.qualification) > -1) {
            if (this.qualification !== this.AdData.qualification) {
              this.otherQualification.push(this.AdData);
            }
          }
        } else {
          if (x.indexOf(this.AdData.qualification) > -1 && this.AdData.drivingLicence === this.employeLicense) {
            if (this.qualification !== this.AdData.qualification) {
              this.otherQualification.push(this.AdData);
            }
          }
        }

        // tslint:disable-next-line: prefer-for-of
        for (let xc = 0; xc < this.AdData.otherQualification.length; xc++) {
          // tslint:disable-next-line: max-line-length
          if (this.AdData.otherQualification[xc].drivingLicence === 'BENEFICIAL' || this.AdData.otherQualification[xc].drivingLicence === 'NO') {
            if (x.indexOf(this.AdData.otherQualification[xc].qualification) > -1) {
              if (this.qualification !== this.AdData.otherQualification[xc].qualification) {
                this.otherQualification.push(this.AdData.otherQualification[xc]);
              }
            }
          } else {
            // tslint:disable-next-line: max-line-length
            if (x.indexOf(this.AdData.otherQualification[xc].qualification) > -1 && this.AdData.otherQualification[xc].drivingLicence === this.employeLicense) {
              if (this.qualification !== this.AdData.otherQualification[xc].qualification) {
                this.otherQualification.push(this.AdData.otherQualification[xc]);
              }
            }
          }
        }
      }
      // console.log('newd data 2', this.otherQualification);
    }
  }
  moreAd(data) {
    // console.log('my data ', data);
    localStorage.removeItem('otherData');
    localStorage.setItem('otherData', JSON.stringify(data));
    if (this.type !== '') {
      this.router.navigate(['employee/appointments/ads/ad/details', {
        type: this.type
      }]);
    } else {
      this.navController.navigateForward('employee/appointments/ads/ad/details');
    }
  }
  navigateAdDetails() {
    localStorage.removeItem('otherData');

    if (this.type !== '') {
      this.router.navigate(['employee/appointments/ads/ad/details', {
        type: this.type
      }]);
    } else {
      this.navController.navigateForward('employee/appointments/ads/ad/details');
    }
  }

}
