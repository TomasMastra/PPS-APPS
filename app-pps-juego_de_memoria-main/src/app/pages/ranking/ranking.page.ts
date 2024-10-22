import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonImg, IonButtons, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { ScoreModel } from 'src/app/models/score';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonButton, IonItem, IonButtons, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RankingPage implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private storeServ:StoreService = inject(StoreService);
  private router:Router = inject(Router);
  
  scoresFacil: ScoreModel[] = [];
  scoresMedio: ScoreModel[] = [];
  scoresDificil: ScoreModel[] = [];

  estadoFacil: boolean = true;
  estadoMedio: boolean = false;
  estadoDificil: boolean = false;
  
  constructor() { }
  
  public cerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl("/login"));
  }

  goTo(to:string){
    this.router.navigateByUrl(to);
  }

  ngOnInit() {
    this.storeServ.traerTopScorePorDificultad('Facil').subscribe( (data) => {
      this.scoresFacil = data
    });
    this.storeServ.traerTopScorePorDificultad('Medio').subscribe( (data) => {
      this.scoresMedio = data
    });
    this.storeServ.traerTopScorePorDificultad('Dificil').subscribe( (data) => {
      this.scoresDificil = data
    });
  }

  cambiarEstado(nivel: string) {
    switch(nivel) {
        case 'facil':
            this.estadoFacil = true;
            this.estadoMedio = false;
            this.estadoDificil = false;
            break;

        case 'medio':
            this.estadoFacil = false;
            this.estadoMedio = true;
            this.estadoDificil = false;
            break;

        case 'dificil':
            this.estadoFacil = false;
            this.estadoMedio = false;
            this.estadoDificil = true;
            break;

        default:
            // Manejo de caso por defecto si es necesario
            break;
    }
}

}
