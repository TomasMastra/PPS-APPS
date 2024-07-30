import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonFab, IonImg, IonFabButton, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonButton, IonGrid, 
  IonCol, IonRow, IonLabel, IonItem, IonText, IonFooter, IonButtons, IonSpinner } from '@ionic/angular/standalone';
import { StoreService } from 'src/app/services/store.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { FotosModel } from 'src/app/models/fotos';
import { Router, RouterModule } from '@angular/router';
import { Motion } from '@capacitor/motion';

type Voto = 'like' | 'dislike';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.page.html',
  styleUrls: ['./cosas-feas.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonButtons, IonFooter, IonText, IonItem, IonLabel, 
    IonRow, IonCol, IonGrid, IonButton, IonCardContent, IonCardHeader, 
    IonCardSubtitle, IonCardTitle, IonFabButton, IonImg, IonFab, IonSpinner, IonCard, 
    IonContent, IonHeader, IonTitle, IonToolbar, FormsModule, CommonModule]
})
export class CosasFeasPage implements OnInit, OnDestroy {

  private router:Router = inject(Router);


  fotosFeas!: FotosModel[];
  fotoActual!: FotosModel;
  indexActual: number = 0;
  spinner!: true;

  private isCooldown: boolean = false;
  private cooldownDuration: number = 1000; 
  private accelListener: any;

  constructor(
    private storeServ: StoreService,
    private storage: Storage,
    private authServ: AuthService,
  ) { }

  ngOnInit() {
    this.storeServ.traerFotosPorTipo('feo').subscribe((data) => {
      this.fotosFeas = data;
      if(this.fotosFeas.length > 0){
        if (this.fotoActual == undefined) {
          this.fotoActual = this.fotosFeas[0];
      
        }
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

      //alert("Movimiento a la izquierda");
      this.changePhoto();
    } else if (event.accelerationIncludingGravity.x < -2) {
      //alert("Movimiento a la derecha");
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

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    let date = new Date();
    let userEmail = this.authServ.usuarioActivo?.email;

    const filepath = `relevamientos/${userEmail! + date}`;
    const fileref = ref(this.storage, filepath);
    const uploadFile = uploadString(fileref, image.base64String!, 'base64');

    uploadFile.then(async (data) => {
      console.log(data.ref.fullPath);

      let foto = <FotosModel>{
        id: date.getTime().toString(),
        refId: '',
        date: date,
        tipo: 'feo',
        user: userEmail,
        url: await getDownloadURL(fileref),
        likes: [
          '',
          userEmail
        ],
        dislikes: [
          ''
        ]
      };
      await this.storeServ.guardarFoto(foto);
    });
  }

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

  votar(id: string, voto: Voto) {
    this.storeServ.updateVoto(id, this.authServ.usuarioActivo!.email, voto);
  }

  volver() {
    this.router.navigateByUrl('/home');
  }

  cerrarSesion() {
    this.authServ.singOutUser().then(() => this.router.navigateByUrl('/login'));
  }

  changePhoto() {
    this.indexActual--;
    this.fotoActual = this.fotosFeas[this.indexActual];


    const currentIndex = this.fotosFeas.findIndex(foto => foto === this.fotoActual);

    if (currentIndex !== -1) {
      const previousIndex = (currentIndex - 1 + this.fotosFeas.length) % this.fotosFeas.length;
      this.fotoActual = this.fotosFeas[previousIndex];
    } else {
      console.error('La foto actual no se encuentra en la lista de fotos');
    }
  }

  nextPhoto() {
    this.indexActual++;
    this.fotoActual = this.fotosFeas[this.indexActual];

    const currentIndex = this.fotosFeas.findIndex(foto => foto === this.fotoActual);

    if (currentIndex !== -1) {
    }
    // Implementa aquí la lógica para mostrar la siguiente foto
  }

  goToImage1(){
    this.indexActual = 0;
    this.fotoActual = this.fotosFeas[0];
}
}
