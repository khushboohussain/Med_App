import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper.service';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit {

  currentUrl: string;
  userType;
  NotificationType;
  today = [];
  yesterday = [];
  older = [];
  NotificationData: any = [];
  altraOlder: any = [];
  $newNotification: Observable<Array<any>>;
  $otherNotifications: Observable<Array<any>>;
  one: Array<any>;
  two: Array<any>;
  qualification = [
    'SANITAETSHELFER',
    'RETTUNGSHELFER',
    'RETTUNGSSANITAETER',
    'RETTUNGSASSISTENT',
    'NOTFALLSANITAETER',
    'ARZT',
    'ARZTRETTUNGSDIENST'
  ];

  constructor(private navController: NavController, private router: Router, private api: ApiService, private helper: HelperService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }


  ngOnInit() {

    this.$newNotification = this.api.getNotifications(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return { did, ...data };
      })));

    // console.log(localStorage.getItem('uid'));
    this.$otherNotifications = this.api.getNewAdNotification()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return { did, ...data };
      })));
    combineLatest(this.$newNotification, this.$otherNotifications)
      .pipe(map(([one, two]) => [...one, ...two]))
      .subscribe((res: Array<any>) => {

        this.NotificationData = res;

        // tslint:disable-next-line: max-line-length
        this.NotificationType = res.filter(data => (data.type === 'offer' || data.type === 'rejected' || data.type === 'new') && data.qualification.toLowerCase() === localStorage.getItem('qualifikation').toLowerCase());
        // console.log(this.NotificationType);
        this.today = this.NotificationType.filter(data => {
          if (this.helper.convertDate(data.date.toDate()) === this.helper.convertDate(new Date())) {
            return data;
          }
        });

        this.yesterday = this.NotificationType.filter(data => {
          const today = moment(this.helper.convertDate(new Date()));
          const otherDate = moment(this.helper.convertDate(data.date.toDate()));
          if (today.diff(otherDate, 'days') === 1) {
            return data;
          }
        });

        this.older = this.NotificationType.filter(data => {
          const today = moment(this.helper.convertDate(new Date()));
          const otherDate = moment(this.helper.convertDate(data.date.toDate()));
          if (today.diff(otherDate, 'days') > 1 && today.diff(otherDate, 'days') <= 7) {
            return data;
          }
        });

        this.altraOlder = this.NotificationType.filter(data => {
          const today = moment(this.helper.convertDate(new Date()));
          const otherDate = moment(this.helper.convertDate(data.date.toDate()));
          if (today.diff(otherDate, 'days') > 1 && today.diff(otherDate, 'days') > 7) {
            this.api.deleteNotification(this.altraOlder.did).then(() => {
              // console.log('notification deleted succesfully');
            });
          }
        });

        for (let i = 0; i < this.NotificationData.length; i++) {
          // console.log(this.NotificationData[i].type);

          // tslint:disable-next-line: max-line-length
          if (this.NotificationData[i].type === 'new' || this.NotificationData[i].type === 'offer' || this.NotificationData[i].type === 'rejected') {
            this.api.getAd(this.NotificationData[i].notificationId).subscribe(ad => {
              // console.log('res', ad);
              if (ad === undefined) {
                this.api.deleteNotification(this.NotificationData[i].did).then(() => {
                  // console.log('deleted ');

                }, err => {
                  console.log('error in notification deleting', err.message);

                });

              } else {  /* if ad is already cofirm than delete apply notifications */

                /* const x = ad.apply.findIndex(data => data.uid === this.NotificationData[i].uid);
                if (x < 0) {
                  this.api.deleteNotification(this.NotificationData[i].did).then(() => {
                    console.log('deleted ');

                  }, err => {
                    console.log('error in notification deleting', err.message);

                  });
                } */

              }
            });
          }

        } // end of for loop






      });

  }

  navigateAppointment(data) {
    // console.log(data);
    localStorage.removeItem('data');
    localStorage.setItem('notification', JSON.stringify(data));
    if (data.type === 'offer') {
      this.api.getAd(data.notificationId).subscribe(res => {
        // console.log(res);
        localStorage.setItem('data', JSON.stringify({ id: data.notificationId, ...res }));
        this.navController.navigateForward('/employee/appointments/appointment');
      });

    } else if (data.type === 'new') {
      this.api.getAd(data.notificationId).subscribe(res => {
        // console.log(res);
        localStorage.setItem('data', JSON.stringify({ id: data.notificationId, ...res }));
        // this.navController.navigateForward('/employee/appointments/ads/ad');
        this.router.navigate(['/employee/appointments/ads/ad', {
          type: 'notification'
        }]);
      });

    } else {
      this.api.getAd(data.notificationId).subscribe(res => {
        // console.log(res);
        localStorage.setItem('data', JSON.stringify({ id: data.notificationId, ...res }));
        this.navController.navigateForward('/employee/appointments/ads/ad');
      });

    }


  }




}
