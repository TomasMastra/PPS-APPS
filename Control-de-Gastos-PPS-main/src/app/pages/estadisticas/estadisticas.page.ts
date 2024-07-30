import { Component, OnInit, ViewChild  } from '@angular/core';
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
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  @ViewChild('canvas') canvas;

  user: any = null;

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
      LinearScale,
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
      { category: 'Alimentos', value: this.currentControl.categories.food },
      { category: 'Medicinas', value: this.currentControl.categories.medicine },
      { category: 'Servicios', value: this.currentControl.categories.services },
      { category: 'Impuestos', value: this.currentControl.categories.taxes },
    ];

    const ctx = this.canvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: control.map(d => d.category),
        datasets: [{
          data: control.map(d => d.value),
          backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1'],
          hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5'],
          borderWidth: 0 
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
         /* padding: {
            top: 20, 
            bottom: 20 
          }*/
        },
        plugins:{
          legend:{
            labels:{
              color: "white",
            }
          }
        }
      }
    });
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
