import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonSelectOption, IonSelect, IonTitle, IonToolbar, IonImg, IonIcon, IonFabButton, IonFabList, IonFab, IonRow, IonItem, IonButton, IonCol, IonInput, IonRouterOutlet, IonFooter } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonFooter, IonRouterOutlet, IonSelectOption, IonSelect, IonInput, IonCol, IonButton, IonItem, IonRow, IonFab, IonFabList, IonFabButton, IonIcon, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule, ReactiveFormsModule
  ] 
})
export class LoginPage implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);

  error: string = '';

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, /*Validators.pattern()*/]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)/*Validators.pattern()*/]),
  });


  constructor() { }

  ingresar(){
    if(this.form.valid){
      let email: string = this.form.get('email')!.value;
      let password: string = this.form.get('password')!.value;

      this.authServ.loginUser(email, password)
        .then( () => {
          this.router.navigateByUrl('/home');
        })
        .catch((error) => {
          // this.error = '';
          // this.error = error;
          console.log(error)
          Swal.fire({
            title: "Usuario inexistente",
            text: "Intentelo nuevamente",
            background: '#1296e2',
            color: '#ffffff',
            showConfirmButton: true,
            confirmButtonText: ' OK',
            confirmButtonColor: '#000000',
            // icon: 'error',
            toast: true,
            position: 'top',
            heightAuto: true
          });
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
