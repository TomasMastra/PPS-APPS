import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonRow, IonApp, IonCol, IonItem, IonFabButton, IonImg, IonButton, IonFabList, IonFab, IonButtons, IonMenu, IonMenuButton, IonInput, IonList, IonLabel, IonAvatar, IonToggle, IonMenuToggle, IonText, IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonToast, IonText, IonToggle, IonAvatar, IonLabel, IonIcon, IonList, IonApp, IonInput, IonButtons, IonFab, IonFabList, IonButton, IonImg, IonFabButton, IonMenu, IonItem, IonCol, IonRow, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonMenuToggle]

})
export class LoginComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router, private toastController: ToastController, private LoadingController: LoadingController) {

  }

  ngOnInit() {


  }

  async iniciarSesion() {
    const mailInput = document.getElementById('mail') as HTMLInputElement;
    const passwordInput = document.getElementById('contraseña') as HTMLInputElement;

    const mail = mailInput.value.trim(); 
    const password = passwordInput.value.trim();



    try {




      const result = await this.afAuth.signInWithEmailAndPassword(mail, password);
      console.log('Inicio de sesión exitoso:', result);

      this.router.navigate(['audios'], { queryParams: { flag: "Espania", tema: "Animal" } });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');

    }
  }

  async autoCompletar(mail: string, password: string) {
    const emailInput = document.getElementById('mail') as HTMLInputElement;
    const passwordInput = document.getElementById('contraseña') as HTMLInputElement;

    emailInput.value = mail;
    passwordInput.value = password;

    
  }
 

}
