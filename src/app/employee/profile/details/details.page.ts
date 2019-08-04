import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { finalize } from 'rxjs/operators';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  form: FormGroup;
  base64Image;
  image;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadImageId;
  data;
  file;


  disableaddress: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, private navController: NavController, private helper: HelperService, private fb: FormBuilder, private fireStorage: AngularFireStorage, private router: Router, private api: ApiService, public location: LocationService) {

    this.location.addressAutocompleteItems = [];
    this.location.addressAutocomplete = {
      query: ''
    };
  }


  ngOnInit() {
    // this.api.getAllEmployees();

    this.form = this.fb.group({
      email: ['',
        // Validators.compose([
        //   Validators.required,
        //   Validators.email
        // ])
      ],
      password: ['',
        // Validators.compose([
        //     Validators.required,
        //     Validators.minLength(6)
        //   ])
      ],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      adresse: ['', Validators.required],
      telefonnumer: ['', Validators.required],
      zugehörigkeit: ['', Validators.required],
      Einsatzradius: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.api.getEmployeeData(localStorage.getItem('uid')).subscribe(res => {
      this.data = res;
      // console.log(this.data);
      this.form.patchValue({
        vorname: this.data.vorname,
        nachname: this.data.nachname,
        email: this.data.email,
        password: this.data.password,
        // adresse: this.data.adresse,
        telefonnumer: this.data.telefonnumer,
        zugehörigkeit: this.data.zugehorigkeit,
        imageURL: this.data.imageURL,
        Einsatzradius: this.data.Einsatzradius,
      });
      this.location.addressAutocomplete = {
        query: this.data.adresse
      };
      this.image = this.data.imageURL;
      // this.form.get('Einsatzradius').setValue(this.data.Einsatzradius);
      // this.form.controls['Einsatzradius'].setValue(this.data.Einsatzradius);

      this.form.get('email').disable();
      this.form.get('password').disable();
    });
    // this.form.patchValue({
    //   vorname: this.data.vorname,
    //   nachname: this.data.nachname,
    //   email: this.data.email,
    //   password: this.data.password,
    //   adresse: this.data.adresse,
    //   telefonnumer: this.data.telefonnumer,
    //   zugehörigkeit: this.data.zugehörigkeit,
    //   Einsatzradius: this.data.Einsatzradius,
    //  });
    // this.form.get('vorname').setValue(this.data.vorname);
    // this.form.controls['nachname'].setValue(this.data.nachname);

  }

  async update() {
    const toast = await this.toastController.create({
      message: 'Erfolgreich aktualisiert.',
      position: 'top',
      duration: 1000
    });
    toast.present();
    this.navController.navigateBack('/employee/profile');
  }


  getLocations() {
    this.location.addressUpdateSearch();
  }

  addressItem(item) {
    this.disableaddress = true;
    this.location.addressAutocomplete.query = item;
    this.form.controls['adresse'].setValue(item);
    // this.myLocation = item;
    // console.log('MY ITEM ', item);

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


  submit(form) {
    this.data = {
      vorname: form.value.vorname,
      nachname: form.value.nachname,
      email: form.value.email,
      password: form.value.password,
      adresse: form.value.adresse,
      telefonnumer: form.value.telefonnumer,
      zugehörigkeit: form.value.zugehörigkeit,
      Einsatzradius: form.value.Einsatzradius,
      latitude: this.location.company.latitude,
      longitude: this.location.company.longitude
    };
    // this.helper.presentLoading();
    this.uploadImage();
  }

  choosePicture() {
    const element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  upload(event) {
    const x: any = document.getElementById('profileImage');
    x.src = URL.createObjectURL(event.target.files[0]);
    this.convert(event.target.files[0]);
  }

  convert(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    try {
      reader.onload = (): void => {
        const base64String: string = (reader.result as string).match(
          /.+;base64,(.+)/
        )[1];
        this.base64Image = base64String;
        this.form.controls['image'].setValue(this.base64Image);
      };
    } catch (e) {
      // no error
    }
  }

  uploadImage() {
    this.ref = this.fireStorage.ref(`Thumbnails/${localStorage.getItem('imgid')}`);
    const task = this.ref.putString('data:image/jpeg;base64,' + this.base64Image, 'data_url');
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.image = url;
          if (this.image !== '') {
            this.data.imageURL = this.image;
            this.updateEmplyeeData();
          }
        });
      })).subscribe();
  }

  updateEmplyeeData() {

    // console.log('update ', this.data);


    // this.api.updateUser(localStorage.getItem('uid'), {
    //   email: this.data.email,
    //   password: this.data.password
    // }).then(res => {
    // console.log('updating values', this.data);

    this.api.updateEmployee(localStorage.getItem('uid'), {
      vorname: this.data.vorname,
      nachname: this.data.nachname,
      // email: this.data.email,
      // password: this.data.password,
      adresse: this.data.adresse,
      telefonnumer: this.data.telefonnumer,
      zugehörigkeit: this.data.zugehörigkeit,
      Einsatzradius: this.data.Einsatzradius,
      imageURL: this.data.imageURL,
      latitude: this.data.latitude,
      longitude: this.data.longitude

    }).then(after => {
      this.helper.presentToast('Profile updated Successfully!');
      this.router.navigate(['employee/profile']);
    }, err => {
      alert(err.message);
    });
  }


}
