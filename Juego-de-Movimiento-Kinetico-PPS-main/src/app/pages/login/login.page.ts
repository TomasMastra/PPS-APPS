import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  admin: boolean = false;
  usuario: boolean = false;
  invitado: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getUserLogged().subscribe((res) => {
      if (res !== null) {
        // Aquí puedes manejar si ya hay un usuario logueado
      }
    });
  }

  loginUser() {
    if (this.email && this.password) {
      this.auth.signIn(this.email, this.password);
    } else {
      this.auth.toast('¡Por favor completa todos los campos!', 'warning');
    }
  }

  cargarUsuario(user: string) {


    this.email = 'admin@admin.com';
    this.password = '111111';
    switch (user) {
      case 'admin':
        this.email = 'admin@admin.com';
        this.password = '111111';
        break;
      case 'tester':
        this.email = 'tester@tester.com';
        this.password = '222222';
        break;
      case 'usuario':
        this.email = 'usuario@usuario.com';
        this.password = '333333';
        break;
      case 'invitado':
        this.email = 'invitado@invitado.com';
        this.password = '444444';
        break;
      default:
        break;
    }
  }
}
