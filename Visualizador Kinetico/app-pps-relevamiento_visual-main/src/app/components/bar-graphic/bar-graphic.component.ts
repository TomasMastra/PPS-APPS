import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EChartsOption, EChartsInitOpts } from 'echarts';
import { NgxEchartsDirective, ThemeOption, provideEcharts,  } from 'ngx-echarts';
import { FotosModel } from 'src/app/models/fotos';
import { StoreService } from 'src/app/services/store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bar-graphic',
  templateUrl: './bar-graphic.component.html',
  styleUrls: ['./bar-graphic.component.scss'],
  standalone:true,
  imports: [
    CommonModule, ReactiveFormsModule, NgxEchartsDirective
  ],
  providers: [
    provideEcharts(),
  ]
})
export class BarGraphicComponent  implements OnInit {
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
    this.storeServ.traerFotosPorTipo('feo').subscribe( async (data) => {
      this.data = data;
      
      const chartData = this.data.map(foto => ({
        id: foto.id,
        name: foto.user + '-' + this.formatDate(foto.date) + '-' + foto.id,
        value: foto.likes.length + foto.dislikes.length - 2,
      })) ?? [];

      this.initOpts = {
        renderer: 'svg',
        width: 300,
        height: 300,
      };
      
      this.options = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: chartData.map(item => item.name),
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        title: {
          left: '50%',
          text: 'Fotos feas',
          subtext: 'Votos (positivos y negativos) por foto',
          textAlign: 'center',
        },
        legend: {
          align: 'auto',
          bottom: 10,
          data: chartData.map(item => item.name),
        },
        calculable: true,
        series: [
          {
            name: 'Votos',
            type: 'bar',
            barWidth: '50%',
            data: chartData,
          },
        ],
      };
    });
  }
}
