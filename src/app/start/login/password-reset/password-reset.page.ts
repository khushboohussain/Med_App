import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  email = '';

  ngOnInit() {
  }
  constructor(public toastController: ToastController, public navController: NavController, private auth: AuthService, public helper: HelperService) { }

  // async passwordReset() {
  //   const toast = await this.toastController.create({
  //     message: 'Wir haben dir erfolgreich einen Link zur Zurücksetzung deines Passworts geschickt.',
  //     duration: 4000,
  //     position: 'top'
  //   });
  //   toast.present();
  //   this.navController.navigateRoot('/start');
  // }

  passwordReset() {
    // console.log('starts of Password reset');

    if (this.email != '') {
      this.auth.resetPassword(this.email)
        .then(res => {
          this.helper.presentToast('Wir haben dir erfolgreich einen Link zur Zurücksetzung deines Passworts geschickt.');
          // this.toastr.success('An Email has sent to your account for Password reset.');
          // this.router.navigate(['login']);
          this.navController.navigateRoot('/start');
        }, err => {
          this.helper.presentToast(err.message + 'Error!');
          // this.toastr.error(err.message,'Error!');
          console.log(err.message);
        });
    } else {
      console.log('Else Condition');

      // this.toastr.warning('Please Provide a Email.','Unable to Proceed');
      this.helper.presentToast('Please Provide a Email.' + 'Unable to Proceed');
      // console.log('Please Provide a Email.', 'Unable to Proceed');
    }

  }
  // Reset Password Method end

}


