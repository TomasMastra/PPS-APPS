import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
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
export class PieGraphicComponent implements OnInit {
  theme!: string | ThemeOption;
  private router:Router = inject(Router);
  private storeServ:StoreService = inject(StoreService);
  options!: EChartsOption;
  private data!:FotosModel[];

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
        text:'Me gustas: ' + (clickedItem.likes.length-1) + ' / ' + 'No me gustas: ' + (clickedItem.dislikes.length -1),
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

      this.options = {
        title: {
          left: '50%',
          text: 'Fotos lindas',
          subtext: 'Votos (positivos y negativos) por foto',
          textAlign: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          align: 'auto',
          bottom: 2,
          data: chartData.map(item => item.name),
        },
        calculable: true,
        series: [
          {
            name: 'Votos',
            type: 'pie',
            radius: [30, 110],
            roseType: 'area',
            data: chartData,
          },
        ],
      };
    });
  }
}