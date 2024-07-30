import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

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
        //this.router.navigate(['/home']);
      }
    });
  }

  loginUser() {
    // let newUser: User = {
    //   userId: '5',
    //   userName: 'Tester',
    //   userEmail: 'tester@tester.com',
    //   userPassword: '555555',
    //   userRol: 'tester',
    //   userSex: 'femenino',
    // };
    // this.auth.registerNewUser(newUser);
    if (this.email && this.password) {
      this.auth.signIn(this.email, this.password);
    } else {
      this.auth.toast('¡Por favor completa todos los campos!', 'warning');
    }
  } // end of loginUser

  loadFastUser(numUser: number) {
    switch (numUser) {
      case 1:
        this.email = 'admin@admin.com';
        this.password = '111111';
        this.admin = true;
        this.usuario = false;
        this.invitado = false;
        break;
      case 2:
        this.email = 'invitado@invitado.com';
        this.password = '222222';
        this.admin = false;
        this.usuario = false;
        this.invitado = true;
        break;
      case 3:
        this.email = 'usuario@usuario.com';
        this.password = '333333';
        this.admin = false;
        this.usuario = true;
        this.invitado = false;
        break;
      default:
        break;
    }
  } // end of loadFastUser
}
