import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { saveAs as importedSaveAs } from 'file-saver';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { type } from 'os';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {
  getData;
  getUserdata;
  getAllEmp;
  getAllUserss;
  ids;
  block: false;
  status: false;
  Allads;
  confirmEmployee;

  // tslint:disable-next-line: max-line-length
  constructor(private navController: NavController, private router: Router, private api: ApiService, private http: HttpClient, private helper: HelperService) { }

  ngOnInit() {
    this.getAllAds();
    this.getEmplyeesData();

  }


  getEmplyeesData() {
    this.getData = JSON.parse(localStorage.getItem('EmployeeData'));
    // console.log('get Data on Employee ', this.getData);
  }

  getAllAds() {
    this.api.getAllAds().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(res => {
      this.Allads = res;
      // console.log('all ads', this.Allads);
      this.Allads.forEach((a) => {
        const y = a.id;
        // console.log(y);
      });

      //  console.log(this.getAllads)
    });
  }


  downloadFile(id) {
    location.href = this.getData.files[id].fileURL;
  }

  downloadCredential1() {
    this.downloadFile(1);
  }
  downloadCredential2() {
    this.downloadFile(2);
  }

  downloadtrainingCertificate() {
    this.downloadFile(3);
  }

  downloadDrivingLisence1() {
    this.downloadFile(4);
  }
  downloadDrivingLisence2() {
    this.downloadFile(5);
  }

  deleteEmployee() {

    this.helper.deleteUser(this.getData.id)
      .subscribe((res: any) => {
        // console.log(res);
        if (res.code === 'auth/user-not-found' || res.statusText === 'ok') {
          this.api.deleteEmployee(this.getData.id)
            .then(res1 => {
              this.api.deleteUser(this.getData.id)
                .then(res2 => {
                  this.Allads.forEach((a, i) => {
                    const y = a.confirmEmployee.findIndex(data => data.uid === this.getData.id);
                    if (y > -1) {
                      this.Allads[i].confirmEmployee.splice(y, 1);
                    }
                  });

                  this.updateaAds();
                  this.router.navigate(['admin/employees']);
                });
            });
        }
      });

  }

  blockEmployee() {
    this.getData.block = true;
    this.api.updateUser(this.getData.id, { block: this.getData.block })
      .then(res => {
        this.router.navigate(['admin/employees']);
      });
  }

  acceptEmployee() {
    this.getData.status = true;
    this.api.updateEmployee(this.getData.id, { status: this.getData.status })
      .then(res => {
        this.helper.sendEmail(this.getData.email)
          .subscribe(resx => { });
        this.router.navigate(['admin/employees']);
      });
  }

  isStatus() {
    if (this.getData.status === true) {
      return true;
    } else {
      return false;
    }
  }

  updateaAds() {
    const batch = this.api.batchWrite();



    this.Allads.forEach((a) => {
      const docRef = this.api.setDocument(a.id);
      batch.set(docRef, a);
    });
    batch.commit().then(res => {

    }, err => {

    });

  }

}
