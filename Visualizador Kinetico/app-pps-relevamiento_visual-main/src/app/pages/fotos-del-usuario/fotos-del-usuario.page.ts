import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonFab, IonImg, IonFabButton, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonButton, IonGrid, IonCol, IonRow, IonLabel, IonItem, IonText, IonFooter, IonButtons } from '@ionic/angular/standalone';
import { StoreService } from 'src/app/services/store.service';
import { AuthService } from 'src/app/services/auth.service';
import { FotosModel } from 'src/app/models/fotos';
import { Router } from '@angular/router';
import { Motion } from '@capacitor/motion';

type Voto = 'like' | 'dislike';

@Component({
  selector: 'app-fotos-del-usuario',
  templateUrl: './fotos-del-usuario.page.html',
  styleUrls: ['./fotos-del-usuario.page.scss'],
  standalone: true,
  imports: [IonButtons, IonFooter, IonText, IonItem, IonLabel, IonRow, IonCol, IonGrid, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFabButton, IonImg, IonFab, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, FormsModule, CommonModule]
})
export class FotosDelUsuarioPage implements OnInit {
  private storeServ:StoreService = inject(StoreService);
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);

  misFotos!: FotosModel[];

  fotoActual!: FotosModel;
  indexActual: number = 0;
  spinner!: true;
  private isCooldown: boolean = false;
  private cooldownDuration: number = 1000; 
  private accelListener: any;
  constructor() { }

  formatDate(tdate: any): string {
    let date = tdate.toDate();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  votar(id:string, user:string, voto:Voto){
    // debugger;
    this.storeServ.updateVoto(id, user, voto);
  }

  volver(){
    this.router.navigateByUrl('/home');
  }

  cerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl('/login'));
   }

  ngOnInit() {
    // debugger;
    this.storeServ.traerFotosPorUsuario(this.authServ.usuarioActivo!.email).subscribe( (data) => {
      // console.log(data);
      this.misFotos = data;

      if (this.fotoActual == undefined) {
        this.fotoActual = this.misFotos[0];
    
      }
    });

    this.initializeMotionListener();

  }

  private initializeMotionListener() {
    this.accelListener = Motion.addListener('accel', (event) => {
      this.handleAcceleration(event);
    });
  }

  async handleAcceleration(event: any) {
    if (this.isCooldown) {
      return;
    }

    this.isCooldown = true;

    if (event.accelerationIncludingGravity.x > 2) {
      this.changePhoto();
    } else if (event.accelerationIncludingGravity.x < -2) {
      this.nextPhoto();
    } else if (event.accelerationIncludingGravity.y > 2) {
      this.goToImage1();
    }

    setTimeout(() => {
      this.isCooldown = false;
    }, this.cooldownDuration);
  }

  ngOnDestroy() {
    if (this.accelListener) {
      this.accelListener.remove();
    }
  }

  changePhoto() {
    this.indexActual--;
    this.fotoActual = this.misFotos[this.indexActual];


    const currentIndex = this.misFotos.findIndex(foto => foto === this.fotoActual);

    if (currentIndex !== -1) {
      const previousIndex = (currentIndex - 1 + this.misFotos.length) % this.misFotos.length;
      this.fotoActual = this.misFotos[previousIndex];
    } else {
      console.error('La foto actual no se encuentra en la lista de fotos');
    }
  }

  nextPhoto() {
    this.indexActual++;
    this.fotoActual = this.misFotos[this.indexActual];

    const currentIndex = this.misFotos.findIndex(foto => foto === this.fotoActual);

    if (currentIndex !== -1) {
    }
    // Implementa aquí la lógica para mostrar la siguiente foto
  }

  goToImage1(){
      this.indexActual = 0;
      this.fotoActual = this.misFotos[0];
  }
}
