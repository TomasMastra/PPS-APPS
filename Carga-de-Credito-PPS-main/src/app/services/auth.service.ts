import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import fire from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  user: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private LoadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.angularFirestore
            .doc<User>(`user/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  } // end of constructor

  async signIn(email, password) {
    try {



      this.angularFireAuth
        .setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
        .then(() => {
          this.angularFireAuth
            .signInWithEmailAndPassword(email, password)
            .then((data) => {
              this.router.navigate(['/home']);
            })
            .catch((error) => {
              this.toast(this.createMessage(error.code), 'danger');
            });
        })
        .catch((error) => {
          this.toast(error.message, 'danger');
        });
    } catch (error) {
      console.log(error.message);
    }
  } // end of signIn

  async signOut() {
    try {


      this.angularFireAuth.signOut().then(() => {
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      });
    } catch (error) {
      console.log(error.message);
    }
  } // end of signOut

  registerNewUser(newUser: User) {
    this.angularFireAuth
      .createUserWithEmailAndPassword(newUser.userEmail, newUser.userPassword)
      .then((data) => {
        this.angularFirestore
          .collection('user')
          .doc(data.user?.uid)
          .set({
            userId: newUser.userId,
            userName: newUser.userName,
            userEmail: newUser.userEmail,
            userRol: newUser.userRol,
            userSex: newUser.userSex,
          })
          .then(() => {
            this.toast('Registrado!!', 'success');
          })
          .catch((error) => {
            this.toast(this.createMessage(error.code), 'danger');
          });
      })
      .catch((error) => {
        this.toast(this.createMessage(error.code), 'danger');
      });
  } // end of registerNewUser

  getUserLogged() {
    return this.angularFireAuth.authState;
  } // end of getUserLogged

  async toast(message, status) {
    try {
      const toast = await this.toastController.create({
        message: message,
        color: status,
        position: 'top',
        duration: 2000,
      });
      toast.present();
    } catch (error) {
      console.log(error.message);
    }
  } // end of toast

  private createMessage(errorCode: string): string {
    let message: string = '';
   
    

    return message;
  } // end of createMessage
}
