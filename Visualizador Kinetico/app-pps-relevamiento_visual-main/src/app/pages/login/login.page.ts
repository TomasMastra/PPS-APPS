import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonRow, IonCol, IonItem, IonFabButton, IonImg, IonButton, IonFabList, IonFab, IonButtons, IonMenu, IonMenuButton, IonInput, IonList, IonLabel, IonAvatar, IonToggle, IonMenuToggle, IonText, IonToast } from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToast, IonText, IonToggle, IonAvatar, IonLabel, IonIcon, IonList, IonInput, IonButtons, IonFab, IonFabList, IonButton, IonImg, IonFabButton, IonMenu, IonItem, IonCol, IonRow, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, ReactiveFormsModule, IonMenuToggle]
})
export class LoginPage implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);
  private toast:ToastController = inject(ToastController);

  isToastOpen = false;
  error:string = '';

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }


  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, /*Validators.pattern()*/]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
  });


  constructor() { }

  async ingresar(){
    if(this.form.valid){
      let email: string = this.form.get('email')!.value;
      let password: string = this.form.get('password')!.value;

      await this.authServ.loginUser(email, password)
        .then( () => {
          this.router.navigateByUrl('/home');
        })
        .catch(async (error) => {
          let message: string;
          switch (error.code) {
            case 'auth/invalid-credential':
              message = 'No se encontró una cuenta con este correo electrónico.';
              break;
            default:
              message = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
          }
          // const toast = await this.toast.create({
          //   message: message,
          //   duration: 3000,
          //   position: 'middle',
          // });
          
          this.error = message;
          // await toast.present();
          this.setOpen(true);
        });
    }
  }



  cargarUsuario(user:string){
    let email:string = '';
    let contraseña:string = '';

    switch(user){
      case 'admin':
        email = 'admin@admin.com';
        contraseña = '111111';
        break;
      case 'invitado':
        email = 'invitado@invitado.com';
        contraseña = '222222';
        break;
      case 'usuario':
        email = 'usuario@usuario.com';
        contraseña = '333333';
        break;
      case 'anonimo':
        email = 'anonimo@anonimo.com';
        contraseña = '444444';
        break;
      case 'tester':
        email = 'tester@tester.com';
        contraseña = '555555';
        break;
    }

    this.form.patchValue({
      email: email,
      password: contraseña
    });
    
  }
  
  ngOnInit() {
  }

}
