import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {

  currentUrl: string;
  userType;
  getAllEmp;
  all;
  count: number;

  constructor(private navController: NavController, private router: Router, private api: ApiService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }


  ngOnInit() {
    this.GetAllEmployees();
  }

  GetAllEmployees() {
    this.api.getAllEmployees().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(res => {
      // console.log(res);

      this.getAllEmp = res;
      this.count = this.getAllEmp.length;
      this.all = this.getAllEmp;

      //  console.log(this.getAllEmp)
    });
  }

  navigateEmployee(item) {
    // console.log(item);
    localStorage.setItem('EmployeeData', JSON.stringify(item));
    this.navController.navigateForward('/admin/employees/employee');
  }


  onSearchChange(value: string) {
    if (value === '') {
      this.getAllEmp = this.all;
    }
    const y = value.toLowerCase();
    const x = this.all.filter(data => (data.vorname + ' ' + data.nachname).toLowerCase().indexOf(y) > -1);
    if (x.length > 0) {
      this.getAllEmp = x;
    } else {
      this.getAllEmp = [];
    }
  }

}
