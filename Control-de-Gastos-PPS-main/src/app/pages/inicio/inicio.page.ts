import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.navigate(['inicio/gastos']);
  }

  logOut() {
    this.authService.signOut();
  }
}
