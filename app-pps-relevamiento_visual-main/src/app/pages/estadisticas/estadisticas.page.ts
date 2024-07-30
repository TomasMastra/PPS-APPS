import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { ECharts, EChartsOption } from 'echarts';
import { StoreService } from 'src/app/services/store.service';
import { FotosModel } from 'src/app/models/fotos';
import { PieGraphicComponent } from 'src/app/components/pie-graphic/pie-graphic.component';
import { BarGraphicComponent } from 'src/app/components/bar-graphic/bar-graphic.component';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone: true,
  imports: [IonButtons, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, CommonModule, PieGraphicComponent, BarGraphicComponent]
})
export class EstadisticasPage implements OnInit {
  private router:Router = inject(Router);
  private storeServ:StoreService = inject(StoreService);
  private authServ:AuthService = inject(AuthService);

  fotosLindas!: FotosModel[];
  fotosFeas!: FotosModel[];

  constructor() { }

  volver(){
    this.router.navigateByUrl('/home');
  }

  cerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl('/login'));
  }
  
  ngOnInit() {
    this.storeServ.traerFotosPorTipo('feo').subscribe( (data) => {
      this.fotosFeas = data;
    });
    this.storeServ.traerFotosPorTipo('lindo').subscribe( (data) => {
      this.fotosLindas = data;
    });
  }
}
