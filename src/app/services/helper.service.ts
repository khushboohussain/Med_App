import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as haversine from 'haversine';

// import { HttpClient, RequestOptions, Headers } from 'selenium-webdriver/http';
// import { RequestOptions, Headers } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  loading;
  adDetail: BehaviorSubject<any>;
  getEmployeedata;
  step2;


  constructor(public toastController: ToastController, private loadingController: LoadingController, public http: HttpClient) {
    if (localStorage.getItem('adDetail')) {
      this.adDetail = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('adDetail')));
    } else {
      this.adDetail = new BehaviorSubject<any>({});
    }
  }

  // setAdDetails(val){
  //   this.adDetail.next(val);
  // }

  // getAdDetails(): Observable<any> {
  //   return this.adDetail.asObservable();
  // }

  async presentToast(MSG) {
    const toast = await this.toastController.create({
      message: MSG,
      duration: 4000,
      position: 'top',
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please Wait...',
      duration: 15000
    });
    await this.loading.present();
  }

  closeLoading() {
    this.loading.dismiss();
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }




  // Delete User
  deleteUser(id: string) {
    // const myHeaders = new HttpHeaders();
    // myHeaders.append('Content-Type', 'application/json');
    // tslint:disable-next-line: deprecation
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    // const options = new RequestOptions({ headers: myHeaders });
    // call request
    return this.http.post(' https://us-central1-medapp-88989.cloudfunctions.net/deleteUser/delete/', {
      uid: id
    }, options);
  }


  /*  Update HttpClient
    import { HttpClient, HttpHeaders } from "@angular/common/http";
    private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   */

  /*
  PRE
   headers: Headers = new Headers({ 'Content-Type': 'application/json' });
   options: RequestOptions = new RequestOptions({ headers: this.headers });
  */


  sendEmail(email: string) {
    // const myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');
    // const options = new RequestOptions({ headers: myHeaders });
    // return this.http.post(' http://localhost:3000/sendemail/', {
    //   email: email
    // }, options);
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post('http://localhost:3000/sendemail/', {
      email
    }, options);

  }

  convertDate(x) {
    // tslint:disable-next-line: max-line-length
    return `${x.getFullYear()}-${(x.getMonth() + 1) < 10 ? ('0' + (x.getMonth() + 1)) : (x.getMonth() + 1)}-${(x.getDate() < 10) ? ('0' + (x.getDate())) : x.getDate()}`;

  }

  filterAds(result, getEmployeedata, step2, x) {
    this.getEmployeedata = getEmployeedata;
    this.step2 = step2;
    const distance = haversine({
      latitude: this.getEmployeedata.latitude,
      longitude: this.getEmployeedata.longitude
    },
      {
        latitude: result.latitude,
        longitude: result.longitude
      });
    // this is template 3
    if (result.condition3 === true) {
      // this.getads = result;
      this.step2 = result.step2;
      for (let index = 0; index < this.step2.length; index++) {
        // console.log('licence', this.getEmployeedata.führerscheinklasse);
        // testing Qualificaton of Tempalate 3
        if (this.step2[index].drivingLicence === 'BENEFICIAL' || this.step2[index].drivingLicence === 'NO') {
          // tslint:disable-next-line: radix
          if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.step2[index].qualification) > -1) {
            return { matchingQualification: { index, ...result.step2[index] }, ...result };
          }
        } else {
          // tslint:disable-next-line: radix max-line-length
          if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.step2[index].qualification) > -1 && this.step2[index].drivingLicence === this.getEmployeedata.führerscheinklasse) { 
            return { matchingQualification: { index, ...result.step2[index] }, ...result };
          }
        }
        // Testing Other Qualifications of Template 3
        if (this.step2[index].otherQualification.length > 0) {
          for (let xc = 0; xc < this.step2[index].otherQualification.length; xc++) {
            // tslint:disable-next-line: max-line-length
            if (this.step2[index].otherQualification[xc].drivingLicence === 'BENEFICIAL' || this.step2[index].otherQualification[xc].drivingLicence === 'NO') {
              // tslint:disable-next-line: radix max-line-length
              if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(this.step2[index].otherQualification[xc].qualification) > -1) {
                return { matchingQualification: { index, ...result.step2[index].otherQualification[xc] }, ...result };
              }
            } else {
              // tslint:disable-next-line: radix max-line-length
              if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(this.step2[index].otherQualification[xc].qualification) > -1 && this.step2[index].otherQualification[xc].drivingLicence === this.getEmployeedata.führerscheinklasse) {
                return { matchingQualification: { index, ...result.step2[index].otherQualification[xc] }, ...result };
              }

            }
          }
        }
      }
    } else {  // for template 1 & 2
      // testing Qualificaton of Template 1 & 2

      // Testing other data or other Qualification
      if (result.otherQualification.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < result.otherQualification.length; index++) {
          // tslint:disable-next-line: max-line-length
          if (result.otherQualification[index].drivingLicence === 'BENEFICIAL' || result.otherQualification[index].drivingLicence === 'NO') {
            // tslint:disable-next-line: radix max-line-length
            // console.log(distance);
            // console.log(parseInt(this.getEmployeedata.Einsatzradius));
            // console.log( x.indexOf(result.otherQualification[index].qualification));
            // tslint:disable-next-line: radix max-line-length
            if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.otherQualification[index].qualification) > -1) {

              return { matchingQualification: result.otherQualification[index], ...result };
            // tslint:disable-next-line: radix
            } else if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.qualification) > -1) {
              return { matchingQualification: result.qualification, ...result };
            }
          } else {
            // tslint:disable-next-line: radix max-line-length
            if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.otherQualification[index].qualification) > -1 && result.otherQualification[index].drivingLicence === this.getEmployeedata.führerscheinklasse) {
              return { matchingQualification: result.otherQualification[index], ...result };
            // tslint:disable-next-line: radix max-line-length
            } else if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.qualification) > -1 && result.drivingLicence === this.getEmployeedata.führerscheinklasse) {
              return { matchingQualification: result.qualification, ...result };
            }

          }

        }
      } else {
        if (result.drivingLicence === 'BENEFICIAL' || result.drivingLicence === 'NO') {
          // tslint:disable-next-line: radix otherQualification
          if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.qualification) > -1) {
            return { matchingQualification: result.qualification, ...result };
          }
        } else {
          // tslint:disable-next-line: radix max-line-length
          if (parseInt(this.getEmployeedata.Einsatzradius) >= distance && x.indexOf(result.qualification) > -1 && result.drivingLicence === this.getEmployeedata.führerscheinklasse) {
            return { matchingQualification: result.qualification, ...result };
          }
        }
      }






    }
  }



}
