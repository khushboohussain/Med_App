import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  form: FormGroup;
  userData: any;
  disableaddress = true;
  myLocation: string;



  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, private navController: NavController, private api: ApiService, private fb: FormBuilder, private helper: HelperService, public location: LocationService) {
    this.location.addressAutocompleteItems = [];
    this.location.addressAutocomplete = {
      query: ''
    };
    // console.log('this query', this.location.addressAutocomplete.query);

  }

  ngOnInit() {
    this.form = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      telephone: ['', Validators.required],
      CompanyName: ['', Validators.required],
      // address: ['', Validators.required],
      role: [''],
      email: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }, Validators.compose([
        Validators.required
      ])],
    });

    this.api.getUser(localStorage.getItem('uid')).subscribe(res => {

      this.userData = res;
      // console.log(this.userData);
      this.api.getEmployerData(localStorage.getItem('uid')).subscribe(resy => {
        this.userData = { ...this.userData, ...resy };

        this.myLocation = this.userData.address;
        // console.log('my Location is ', this.myLocation);

        this.location.addressAutocomplete = {
          query: this.myLocation
        };
        // console.log('this query', this.location.addressAutocomplete.query);

        this.form.patchValue({
          'vorname': this.userData.vorname,
          'nachname': this.userData.nachname,
          'telephone': this.userData.telephone,
          'CompanyName': this.userData.CompanyName,
          // 'location.addressAutocomplete.query': this.myLocation,
          'role': this.userData.role,
          'email': this.userData.email,
          'password': this.userData.password
        });
        // console.log("this is working..." + this.form.get('vorname').value);

        // this.form.get('vorname').setValue(this.userData.vorname);
        // this.form.get('nachname').setValue(this.userData.nachname);
        // this.form.get('telephone').setValue(this.userData.telephone);
        // this.form.get('CompanyName').setValue(this.userData.CompanyName);
        // this.form.get('address').setValue(this.userData.address);
        // this.form.get('role').setValue(this.userData.role);
        // this.form.get('email').setValue(this.userData.email);
        // this.form.get('password').setValue(this.userData.password);

        // console.log(this.userData);
      }, err => {
        // console.log(err.message);
      });
    });


  }
  // end ngOnInit

  update(data) {
    if (this.myLocation === '') {
      alert('Please file the address field');
    } else {
      const formData = {
        vorname: data.value.vorname,
        nachname: data.value.nachname,
        telephone: data.value.telephone,
        CompanyName: data.value.CompanyName,
        role: data.value.role,
        email: data.value.email,
        password: data.value.password
      };
      // console.log(formData);
      this.api.updateEmployerData(localStorage.getItem('uid'), {
        vorname: formData.vorname,
        nachname: formData.nachname,
        telephone: formData.telephone,
        CompanyName: formData.CompanyName,
        address: this.myLocation,
        role: formData.role,
      }).then(() => {
        this.helper.presentToast('Erfolgreich aktualisiert.');
        this.navController.navigateBack('/employer/profile');

      }, err => {
        this.helper.presentToast(err.message);
      });
    } // else ended

  }

  get f() {
    return this.form.controls;
  }

  getLocations() {
    this.location.addressUpdateSearch();
  }

  addressItem(item) {
    this.disableaddress = true;
    this.location.addressAutocomplete.query = item;
    // this.form.controls['address'].setValue(item);
    this.myLocation = item;
    console.log('MY ITEM ', this.myLocation);

    this.location.addressChooseItem(item);
  }

  pickupBlur() {
    if (this.location.addressAutocomplete.query.length === 0) {
      this.disableaddress = true;
    }
  }

  pickupFocus() {
    this.disableaddress = false;
  }


}
