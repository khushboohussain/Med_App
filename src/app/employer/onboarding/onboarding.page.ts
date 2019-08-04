import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  form: FormGroup;
  data: any;
  disableaddress: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(private navController: NavController, private fb: FormBuilder, private api: ApiService, private helper: HelperService, public location: LocationService) {
    this.location.addressAutocompleteItems = [];
    this.location.addressAutocomplete = {
      query: ''
    };
  }

  ngOnInit() {
    this.form = this.fb.group({
      role: [' ',],
      CompanyName: ['', Validators.required],
      address: [' ',],
      telephone: ['', Validators.required]
    });

  }

  getLocations() {
    this.location.addressUpdateSearch();
  }

  addressItem(item) {
    this.disableaddress = true;
    this.location.addressAutocomplete.query = item;
    this.form.controls['address'].setValue(item);
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


  submit(form: any) {
    this.data = {
      role: form.value.role,
      CompanyName: form.value.CompanyName,
      address: form.value.address,
      telephone: form.value.telephone
    };

    this.api.updateEmployerData(localStorage.getItem('uid'), this.data).then(res => {

      this.helper.presentToast('Company record save successfully!');
      this.navController.navigateRoot('/employer/ads');

    }, err => {
      this.helper.presentToast(err.message);
    });
  }
}
