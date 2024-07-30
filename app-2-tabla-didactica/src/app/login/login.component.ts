import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {}

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

  autoCompletar(mail: string, password: string) {
    const emailInput = document.getElementById('mail') as HTMLInputElement;
    const passwordInput = document.getElementById('contraseña') as HTMLInputElement;

    emailInput.value = mail;
    passwordInput.value = password;

  }
}
