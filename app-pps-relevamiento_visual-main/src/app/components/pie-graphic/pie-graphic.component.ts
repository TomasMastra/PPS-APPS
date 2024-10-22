import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, ThemeOption, provideEcharts } from 'ngx-echarts';
import { FotosModel } from 'src/app/models/fotos';
import { StoreService } from 'src/app/services/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pie-graphic',
  templateUrl: './pie-graphic.component.html',
  styleUrls: ['./pie-graphic.component.scss'],
  standalone:true,
  imports: [
    CommonModule, ReactiveFormsModule, NgxEchartsDirective
  ],
  providers: [
    provideEcharts(),
  ]
})
export class PieGraphicComponent   {
  theme!: string | ThemeOption;
  private router:Router = inject(Router);
  private storeServ:StoreService = inject(StoreService);
  options!: EChartsOption;
  private data!:FotosModel[];
  initOpts!:any;


  constructor() { }

  formatDate(tdate: any): string {
    let date = tdate.toDate();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  async onChartClick(event: any) {
    const clickedItem = this.data.find(foto => foto.id === event.data.id);
    console.log(clickedItem);
    if (clickedItem) {
      await Swal.fire({
        title: clickedItem.user + ' - ' + this.formatDate(clickedItem.date),
        text:'Me gustas: ' + (clickedItem.likes.length-1),
        imageUrl: clickedItem.url,
        imageWidth: 'auto',
        imageHeight: 'auto',
        imageAlt: "foto",
        toast: true,
      });
    }
  }
  ngOnInit() {
    this.storeServ.traerFotosPorTipo('lindo').subscribe( async (data) => {
      this.data = data;

      const chartData = this.data.map(foto => ({
        id: foto.id,
        name: foto.user + '-' + this.formatDate(foto.date) + '-' + foto.id,
        value: foto.likes.length + foto.dislikes.length - 2,
      })) ?? [];


      this.initOpts = {
        renderer: 'svg',
        width: 400,
        height: 400,
      };
      
      this.options = {
        
        title: {
          left: '50%',
          text: 'Fotos lindas',
          textAlign: 'center',
          top: 5,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',  // Cambia la orientación si es necesario
          bottom: '20%',         // Ajusta la distancia desde la parte inferior (ajusta el porcentaje según sea necesario)
          itemGap: 5,           // Espaciado entre los elementos de la leyenda
          data: chartData.map(item => item.name),
        },
        calculable: true,
        series: [
          {
            name: 'Votos',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '40%'],  // Mueve el gráfico más arriba (en el 40% de la altura)
            roseType: 'area',
            data: chartData,
          },
        ],
      };
      
    });
  }
}