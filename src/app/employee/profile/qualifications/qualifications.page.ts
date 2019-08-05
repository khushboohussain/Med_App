import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.page.html',
  styleUrls: ['./qualifications.page.scss'],
})
export class QualificationsPage implements OnInit {

  form: FormGroup;
  data;
  fileArr = [];
  field = [];
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  promises = [];
  urls = [];
  getEmployeeData;
  getEmployeeID;
  filesRecord;
  changedFiles = [];
  extras = [];
  currentSelectedFile: number;
  adQualifications: string;
  makeDisable: boolean;
  // tslint:disable-next-line: max-line-length
  constructor(public toastController: ToastController, private navController: NavController, private helper: HelperService, private fb: FormBuilder, private fireStorage: AngularFireStorage, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.form = this.fb.group({
      qualifikation: ['', Validators.required],
      führerscheinklasse: ['', Validators.required]
    });
    this.api.getPersonalQualification().subscribe((res: any) => {
      this.adQualifications = res.data;
    });
    this.getEmployeeID = localStorage.getItem('uid');
    this.api.getEmployeeData(localStorage.getItem('uid')).subscribe(res => {
      this.getEmployeeData = res;
      if (this.getEmployeeData.führerscheinklasse !== 'NO') {
        this.makeDisable = false;
      } else {
        this.makeDisable = true;
        this.form.get('qualifikation').disable();
        this.form.get('führerscheinklasse').disable();
      }
      this.form.get('qualifikation').setValue(this.getEmployeeData.qualifikation);
      this.form.get('führerscheinklasse').setValue(this.getEmployeeData.führerscheinklasse);
      this.extras.slice(7);
    }, err => {
      console.log(err.message);
    });
    let x: File;
    this.field.push({
      text: '',
      file: x
    });

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

  submit(data) {
    this.changedFiles.forEach((a, i) => {
      this.ref = this.fireStorage.ref('Files/' + a.fileId);
      // console.log(a.file);
      this.task = this.ref.put(a.file);
      this.promises.push(this.task);
      this.urls.push({ ref: this.ref, index: a.index, name: a.name });

      this.task.snapshotChanges().subscribe();

    });

    let total = 0;

    Promise.all(
      this.promises
    )
      .then((url: Array<any>) => {
        this.urls.forEach(a => {
          a.ref.getDownloadURL().subscribe(res => {
            total += 1;
            // console.log(a);
            this.getEmployeeData.files[a.index].fileURL = res;
            this.getEmployeeData.files[a.index].name = a.name;
            // console.log(this.getEmployeeData);
          });
        });
        const interval = setInterval(() => {
          if (total === this.urls.length) {
            clearInterval(interval);
            this.updateEmplyee();
          }
        }, 2000);
      })
      .catch((error) => {
        // console.log(`Some failed: `, error.message);
      });
  }

  uploadFile(event) {
    const x = this.changedFiles.findIndex(data => data.index === this.currentSelectedFile);
    if (x > -1) {
      this.changedFiles[x].file = event.target.files[0];
      this.changedFiles[x].name = event.name;
    } else {
      // console.log(this.currentSelectedFile);
      // console.log(this.extras);
      if (this.currentSelectedFile === this.getEmployeeData.files.length) {
        this.getEmployeeData.files.push(this.extras[this.currentSelectedFile - 7]);
        // console.log(this.getEmployeeData.files);
        this.changedFiles.push({
          index: this.currentSelectedFile,
          file: event.target.files[0],
          fileId: this.getEmployeeData.files[this.currentSelectedFile].fileID,
          name: event.target.files[0].name
        });
      } else {
        this.changedFiles.push({
          index: this.currentSelectedFile,
          file: event.target.files[0],
          fileId: this.getEmployeeData.files[this.currentSelectedFile].fileID,
          name: event.target.files[0].name
        });
      }
    }
  }

  updateEmplyee() {
    // console.log('here');
    this.api.updateEmployee(localStorage.getItem('uid'), this.getEmployeeData)
      .then(after => {
        this.helper.presentToast('Qualification updated successfully');
        this.router.navigate(['employee/profile']);
      });
  }

  addNewfield() {
    this.extras.push({
      fileID: Date.now() * 1000,
      fileURL: '',
      name: ''
    });
  }

  openFile(val) {
    const element: HTMLElement = document.querySelector('input[type="file"]');
    element.click();
    this.currentSelectedFile = val;
  }

}
