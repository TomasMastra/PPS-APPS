import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = null;

  salary: number;
  percentage: number;

  activeMonth: boolean = false;

  loading: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,  ) {}

  async ngOnInit() {
    this.authService.user$.subscribe(async (user: any) => {
      if (user) {
        this.user = user;
        this.firestoreService
          .getMonthlyControls(this.user.userUid)
          .subscribe((controls) => {
            const currentDate = new Date();
            const currentMonth = this.getMonth(currentDate);
            const currentYear = currentDate.getFullYear();
            this.activeMonth = false;
            controls.forEach((control) => {
              if (
                control.month == currentMonth &&
                control.year == currentYear
              ) {
                this.activeMonth = true;
                console.log('Mes activo: ', currentMonth);
              }
            });
            if (this.activeMonth) {
              this.router.navigate(['/inicio']);
            } else {
              this.router.navigate(['/home']);
            }
          });
      } else {
        // this.router.navigate(['/login']);
      }
    });
  }

  logoutUser() {
    this.authService.signOut();
  } // end of logoutUser

  createControl() {
    if (
      this.percentage <= 0 ||
      this.percentage >= 100 ||
      this.salary == undefined ||
      this.percentage == undefined
    ) {
      this.authService.toast(
        'El porcentaje debe ser mayor a 0 y menor a 100',
        'secondary'
      );
    } else if (this.salary <= 0) {
      this.authService.toast(
        'El ingreso mensual debe ser mayor a 0',
        'secondary'
      );
    } else {
      const date = new Date();
      const control: any = {
        userUid: this.user.userUid,
        date: date,
        month: this.getMonth(date),
        year: date.getFullYear(),
        salary: this.salary,
        percentage: this.percentage,
        categories: {
          food: 0,
          medicine: 0,
          services: 0,
          taxes: 0,
        },
      };
      this.firestoreService.createMonthlyControl(control).then(() => {
        this.loading.dismiss();
        this.authService.toast(
          `Control de Gastos ${this.getMonth(
            date
          )} ${date.getFullYear()} Creado.`,
          'success'
        );
      });
    }
  }

  getMonth(date: Date) {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months[date.getMonth()];
  }


}
