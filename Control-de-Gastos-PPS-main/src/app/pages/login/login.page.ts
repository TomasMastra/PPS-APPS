import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: any = {
    email: '',
    password: '',
  };
  type: boolean = true;
  name: boolean = true;

  loading: any;

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
   // await this.showLoading('');
    this.auth.getUserLogged().subscribe((res) => {
     // this.loading.dismiss();
      if (res !== null) {
      }
    });
  }

  changeType() {
    this.type = !this.type;
    this.name = !this.name;
  } // end of changeType

  loginUser() {
    if (this.login.email && this.login.password) {
      this.auth.signIn(this.login.email, this.login.password);
    } else {
      this.auth.toast('¡Por favor completa todos los campos!', 'warning');
    }
  } // end of loginUser

  loadFastUser(numUser: number) {
    switch (numUser) {
      case 1:
        this.login.email = 'admin@admin.com';
        this.login.password = '111111';

        break;
      case 2:
        this.login.email = 'invitado@invitado.com';
        this.login.password = '222222';

        break;
      case 3:
        this.login.email = 'tester@tester.com';
        this.login.password = '555555';

        break;
      default:
        break;
    }
  } // end of loadFastUser



}
