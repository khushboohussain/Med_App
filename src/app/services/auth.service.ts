import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  signup(email: any, password: any) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  login(email: any, password: any) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  setpersistance() {
    return this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  resetPassword(email: any) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  updatePassword(password: any) {
    const user = firebase.auth().currentUser;
    user.updatePassword(password);
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

}
