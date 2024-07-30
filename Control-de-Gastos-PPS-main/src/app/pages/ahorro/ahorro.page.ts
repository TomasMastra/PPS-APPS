import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';

@Component({
  selector: 'app-ahorro',
  templateUrl: './ahorro.page.html',
  styleUrls: ['./ahorro.page.scss'],
})
export class AhorroPage implements OnInit {
  @ViewChild('canvas') canvas;

  user: any = null;

  listControls: any;
  currentControl: any;
  activeMonth: boolean = false;
  currentMonth: string;
  currentYear: any;

  chart: Chart;

  loading: any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController
  ) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale
    );

    Chart.register(...registerables);
  }

  async ngOnInit() {
    await this.showLoading('Cargando...');
    this.authService.user$.subscribe(async (user: any) => {
      this.loading.dismiss();
      await this.showLoading('Cargando...');
      if (user) {
        this.user = user;
        this.firestoreService
          .getMonthlyControls(this.user.userUid)
          .subscribe((controls) => {
            this.listControls = controls;
            const currentDate = new Date();
            this.currentMonth = this.getMonth(currentDate);
            this.currentYear = currentDate.getFullYear();
            this.activeMonth = false;
            controls.forEach((control) => {
              if (
                control.month == this.currentMonth &&
                control.year == this.currentYear
              ) {
                this.activeMonth = true;
                this.currentControl = control;
              }
            });
            this.createChart();
            this.loading.dismiss();
          });
      } else {
        this.loading.dismiss();
      }
    });
  }

  createChart() {
    if(this.chart){
      this.chart.destroy();
    }
    const control = [
      { category: 'Gastos', value: this.getAnnualCost() },
      { category: 'Ahorros', value: this.getAnnualSaving() },
    ];

    const ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: control.map((d) => d.category),
        datasets: [
          {
            label: 'Ahorro vs Gastos',
            data: control.map((d) => d.value),
            backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1'],
            hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5'],
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'white' // Color de las etiquetas del eje X
            }
          },
          y: {
            ticks: {
              color: 'white' // Color de las etiquetas del eje Y
            }
          }
        }
      },
    });
  }

  getAnnualCost(): number {
    let rtn: number = 0;
    for (let i = 0; i < this.listControls.length; i++) {
      const control = this.listControls[i];
      if (control.year == this.currentYear) {
        rtn += control.categories.food;
        rtn += control.categories.medicine;
        rtn += control.categories.services;
        rtn += control.categories.taxes;
      }
    }
    return rtn;
  }

  getAnnualSaving(): number {
    let rtn: number = 0;
    for (let i = 0; i < this.listControls.length; i++) {
      const control = this.listControls[i];
      if (control.year == this.currentYear) {
        rtn += control.salary;
      }
    }
    rtn = rtn - this.getAnnualCost();
    return rtn;
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

  async showLoading(message: string) {
    try {
      this.loading = await this.loadingController.create({
        message: message,
        spinner: 'crescent',
        showBackdrop: true,
      });
      this.loading.present();
    } catch (error) {
      console.log(error.message);
    }
  }
}
