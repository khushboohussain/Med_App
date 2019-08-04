import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.page.html',
  styleUrls: ['./employer.page.scss'],
})
export class EmployerPage implements OnInit {

  data: any;
  isBlocked: boolean;

  constructor(public api: ApiService, private navController: NavController, private helper: HelperService) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('empData'));
    if (this.data.block) {
      if (this.data.block === true) {
        this.isBlocked = true;
      } else {
        this.isBlocked = false;
      }
    }
  }

  blockUser() {
    if (!this.data.block) {
      this.data.block = true;
    }

    this.api.updateEmployerData(localStorage.getItem('empId'), this.data).then(res => {
      this.helper.presentToast(`User block successfully! `);
      this.navController.navigateForward('/admin/employers');
    });



  }

  deleteUser() {

    const uid = localStorage.getItem('empId');
    this.helper.deleteUser(uid).subscribe((res: any) => {
      if (res.code === 'auth/user-not-found' || res.statusText === 'ok' || res.statusText === 'OK' || res.status === 200) {
        this.api.deleteEmployer(uid).then(delEmp => {
          this.api.deleteUser(uid).then(delUser => {
            this.helper.presentToast('Employer Record deleted successfully ');
            this.navController.navigateBack('/admin/employers');
            // this.navController.navigateForward('/admin/employers');
          }, err => {
            this.helper.presentToast('Error in Deleting User record' + err.message);
          });
        }, err => {
          this.helper.presentToast('Error in deleting Employer record' + err.message);
        });
      }
    }, err => {
      this.helper.presentToast('Error in deleting authintication' + err.message);
    });

  }

}
