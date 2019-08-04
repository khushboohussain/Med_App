import { Component, OnInit } from '@angular/core';
import { NavController, IonSlides } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import * as moment from 'moment';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-step2',
  templateUrl: './step2.page.html',
  styleUrls: ['./step2.page.scss'],
})
export class Step2Page implements OnInit {

  @ViewChild('slides', { static: false }) slides: IonSlides;

  form: FormGroup;
  form2: Array<FormGroup> = [];
  data: any;
  record: any;

  newField: any = [];
  days: number;
  otherQualification = '';
  otherRequiredEmployees = null;
  previousData: any;

  option1: boolean;
  option2: boolean;
  option3: boolean;

  actionController: boolean;
  continuoueCheck: boolean;
  dateStart;
  dateEnd: Date;
  extraWorkforce = [];
  adQualifications = [];
  empty: boolean;
  emptyNumber = 0;
  constructor(private navController: NavController, private fb: FormBuilder, private api: ApiService, public helper: HelperService) { }

  ngOnInit() {
    this.api.getPersonalQualification().subscribe((res: any) => {
      this.adQualifications = res.data.reverse();
      // console.log(res);
      // console.log('Qualifications in DataBase', this.adQualifications);
    });
    this.data = JSON.parse(localStorage.getItem('AdsData'));
    // console.log('retrieved Object: \n', this.data);

    this.dateStart = this.data.startDate;

    this.actionController = JSON.parse(localStorage.getItem('actionController'));
    this.continuoueCheck = JSON.parse(localStorage.getItem('continuoueCheck'));

    // checking conditions for showing proper template

    // Template 1 will execute
    if (this.actionController === true && this.continuoueCheck === false) {
      this.option1 = true;
      this.option2 = false;
      this.option3 = false;
      // from builder
      this.form = this.fb.group({
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        qualification: ['', Validators.required],
        requiredEmployees: ['', Validators.required],
        wage: ['', Validators.required],
        wageType: ['', Validators.required],
        drivingLicence: ['', Validators.required]

      });

    } else if (this.actionController === true && this.continuoueCheck === true) {
      this.option1 = false;
      this.option2 = true;
      this.option3 = false;
      // from builder
      this.form = this.fb.group({
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        qualification: ['', Validators.required],
        requiredEmployees: ['', Validators.required],
        wage: ['', Validators.required],
        wageType: ['', Validators.required],
        drivingLicence: ['', Validators.required]
      });
      // Template 3
    } else if (this.actionController === false && this.continuoueCheck === false) {
      this.option1 = false;
      this.option2 = false;
      this.option3 = true;
      // from builder
      this.form = this.fb.group({
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        qualification: ['', Validators.required],
        requiredEmployees: ['', Validators.required],
        wage: ['', Validators.required],
        wageType: ['', Validators.required],

        drivingLicence: ['', Validators.required]
      });

      this.days = JSON.parse(localStorage.getItem('days'));


      for (let i = 0; i < this.days; i++) {
        this.form2.push(
          this.form = this.fb.group({
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            qualification: ['', Validators.required],
            requiredEmployees: ['', Validators.required],
            wage: ['', Validators.required],
            wageType: ['', Validators.required],
            drivingLicence: ['', Validators.required]
          })
        );
      }
      setTimeout(() => {
        this.slides.lockSwipes(true);
      }, 1000);

    }
  } /* ngOnInit end */

  // For adding new input field for template 1 and 2
  addFieldx() {
    this.emptyNumber += 1;
    this.otherQualification = '';
    this.otherRequiredEmployees = null;
    this.newField.push({
      otherQualification: '',
      otherRequiredEmp: 0,
      wage: 0,
      wageType: '',
      drivingLicence: ''
    });
    this.empty = true;
  }
  removeFieldx(index: number) {
    this.emptyNumber -= 1;
    this.newField.splice(index, 1);
    if (this.emptyNumber === 0) {
      this.empty = false;
    } else {
      this.empty = true;
    }
  }
  // For adding new input field for template 3
  addField(i: number) {
    this.emptyNumber += 1;
    if (i >= 0) {
      this.extraWorkforce.push({
        qualification: '',
        requiredEmployees: 0,
        wage: 0,
        wageType: '',
        drivingLicence: '',
        index: i
      });
    } else {
      this.extraWorkforce.push({
        qualification: '',
        requiredEmployees: 0,
        wage: 0,
        wageType: '',
        drivingLicence: ''
      });
    }
    this.empty = true;
    // console.log(this.extraWorkforce)

  }
  removeField(index) {
    this.emptyNumber -= 1;
    this.extraWorkforce.splice(index, 1);
    if (this.emptyNumber === 0) {
      this.empty = false;
    } else {
      this.empty = true;
    }

  }
  getValues(form: any, i: number) {
    this.previousData = form[i - 1].value;

    this.previousData.otherQualification = [];

    this.extraWorkforce.forEach(a => {
      if (a.index === i - 1) {
        this.previousData.otherQualification.push(a);
      }
    });
    this.form2[i].controls.startTime.setValue(this.previousData.startTime);
    this.form2[i].controls.endTime.setValue(this.previousData.endTime);
    this.form2[i].controls.qualification.setValue(this.previousData.qualification);
    this.form2[i].controls.requiredEmployees.setValue(this.previousData.requiredEmployees);
    this.form2[i].controls.wage.setValue(this.previousData.wage);
    this.form2[i].controls.wageType.setValue(this.previousData.wageType);
    this.form2[i].controls.drivingLicence.setValue(this.previousData.drivingLicence);


    const len = this.previousData.otherQualification.length;

    // this.extraWorkforce = [];
    for (let index = 0; index < len; index++) {
      this.extraWorkforce.push({
        qualification: this.previousData.otherQualification[index].qualification,
        requiredEmployees: this.previousData.otherQualification[index].requiredEmployees,
        wage: this.previousData.otherQualification[index].wage,
        wageType: this.previousData.otherQualification[index].wageType,
        drivingLicence: this.previousData.otherQualification[index].drivingLicence,
        index: i
      });

    }
  }


  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext().then(() => { this.slides.lockSwipes(true); });
    // console.log(this.extraWorkforce);
  }

  goBack() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev().then(() => { this.slides.lockSwipes(true); });
  }

  // Form Submit Method
  submitForm(form: any) {
    // submit method for template 1 and 3
    // console.log('form values ', form);
    if (this.option2 !== true) {
      // for condition 3
      if (this.option3 === true) {
        this.record = {
          jobTitle: this.data.jobTitle,
          location: this.data.address,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          fastReply: this.data.fastReply,
          latitude: this.data.latitude,
          longitude: this.data.longitude,

          confirmEmployee: [],
          confirmEmployeeIds: [],
          apply: [],
          step2: [],
          uid: localStorage.getItem('uid'),
          condition1: false,
          condition2: false,
          condition3: true
        };
        form.forEach(a => {
          this.record.step2.push(
            {
              startTime: moment(a.value.startTime).format('HH:mm'),
              endTime: moment(a.value.endTime).format('HH:mm'),
              qualification: a.value.qualification,
              requiredEmployees: a.value.requiredEmployees,
              wage: a.value.wage,
              wageType: a.value.wageType,
              drivingLicence: a.value.drivingLicence,
              otherQualification: []
            }
          );
        });

        if (this.extraWorkforce.length > 0) {
          this.extraWorkforce.forEach(a => {
            if (a.index >= 0) {
              this.record.step2[a.index].otherQualification.push({
                qualification: a.qualification,
                requiredEmployees: a.requiredEmployees,
                wage: a.wage,
                wageType: a.wageType,
                drivingLicence: a.drivingLicence
              });
            }
          });
        }
        // console.log(this.record);
        // console.log('Qualifications from DB', this.record.qualification);
        this.api.createAds({ status: 'open', rejectedEmployee: [], ...this.record })
          .then(res => {
            this.helper.presentToast(' Ad Created Successfuliy!');
            this.navController.navigateRoot('/employer/ads/create/step3');
          }, err => {
            this.helper.presentToast(err.message + 'Error!');
          });

        // end of template 3
      } else {   /* for condition 1 */
        const record = {
          jobTitle: this.data.jobTitle,
          location: this.data.address,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          fastReply: this.data.fastReply,
          latitude: this.data.latitude,
          longitude: this.data.longitude,

          confirmEmployee: [],
          confirmEmployeeIds: [],
          apply: [],

          startTime: moment(form.value.startTime).format('HH:mm'),
          endTime: moment(form.value.endTime).format('HH:mm'),

          qualification: form.value.qualification,
          requiredEmployees: form.value.requiredEmployees,
          otherQualification: [],
          wage: form.value.wage,
          wageType: form.value.wageType,
          drivingLicence: form.value.drivingLicence,
          uid: localStorage.getItem('uid'),
          condition1: true,
          condition2: false,
          condition3: false
        };
        // console.log(record);
        this.newField.forEach(a => {
          record.otherQualification.push({
            qualification: a.otherQualification,
            requiredEmployees: a.otherRequiredEmp,
            wage: a.wage,
            wageType: a.wageType,
            drivingLicence: a.drivingLicence
          });
        });
        // console.log(record);
        // console.log('Qualifications from DB', record.qualification);
        this.api.createAds({ status: 'open', rejectedEmployee: [], ...record })
          .then(res => {
            this.helper.presentToast(' Ad Created Successfuliy!');
            this.navController.navigateRoot('/employer/ads/create/step3');
          }, err => {
            this.helper.presentToast(err.message + 'Error!');
          });
      }

    } else {
      // for tempate 2
      const record = {
        jobTitle: this.data.jobTitle,
        location: this.data.address,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        fastReply: this.data.fastReply,
        latitude: this.data.latitude,
        longitude: this.data.longitude,

        otherQualification: [],

        confirmEmployee: [],
        confirmEmployeeIds: [],
        apply: [],

        startTime: moment(form.value.startTime).format('HH:mm'),
        endTime: moment(form.value.endTime).format('HH:mm'),

        qualification: form.value.qualification,
        requiredEmployees: form.value.requiredEmployees,
        wage: form.value.wage,
        wageType: form.value.wageType,
        drivingLicence: form.value.drivingLicence,
        uid: localStorage.getItem('uid'),
        condition1: false,
        condition2: true,
        condition3: false

      };
      // console.log(record);
      this.newField.forEach(a => {
        record.otherQualification.push({
          qualification: a.otherQualification,
          requiredEmployees: a.otherRequiredEmp,
          wage: a.wage,
          wageType: a.wageType,
          drivingLicence: a.drivingLicence
        });
      });
      // console.log(record);
      console.log('Qualifications from DB', record.qualification);
      this.api.createAds({ status: 'open', rejectedEmployee: [], ...record })
        .then(res => {
          this.helper.presentToast(' Ad Created Successfuliy!');
          this.navController.navigateRoot('/employer/ads/create/step3');
        }, err => {
          this.helper.presentToast(err.message + 'Error!');
        });

    }

    // end Else Bloack
  } // end SubmitForm method


  get f() {
    return this.form.controls;
  }
  gettingModelValues(data) {
    // console.log('data is ', data);
    // tslint:disable-next-line: max-line-length
    if (data.drivingLicence !== '' && data.otherQualification !== '' && data.otherRequiredEmp !== 0 && data.wage !== 0 && data.wageType !== '') {
      // console.log('working if');
      this.empty = false;
    } else {
      // console.log('else working...');
      this.empty = true;
    }

  }

}
