import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonFab, IonImg, IonFabButton, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonButton, IonGrid, IonCol, IonRow, IonLabel, IonItem, IonText, IonFooter, IonButtons } from '@ionic/angular/standalone';
import { StoreService } from 'src/app/services/store.service';
import { Camera, CameraResultType, CameraSource, } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service';
import { Storage, getDownloadURL, ref,  uploadString } from '@angular/fire/storage';
import { FotosModel } from 'src/app/models/fotos';
import { Router } from '@angular/router';

type Voto = 'like' | 'dislike';

@Component({
  selector: 'app-cosas-feas',
  templateUrl: './cosas-feas.page.html',
  styleUrls: ['./cosas-feas.page.scss'],
  standalone: true,
  imports: [IonButtons, IonFooter, IonText, IonItem, IonLabel, IonRow, IonCol, IonGrid, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFabButton, IonImg, IonFab, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, FormsModule, CommonModule]
})
export class CosasFeasPage implements OnInit {
  private storeServ:StoreService = inject(StoreService);
  private storage:Storage = inject(Storage); 
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);

  fotosFeas!: FotosModel[];

  constructor() { }

  async tomarFoto(){
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
    
    uploadFile.then( async (data) => {
      console.log(data.ref.fullPath);

      let foto = <FotosModel>{
        id: date.getTime().toString(),
        refId: '',
        date: date,
        tipo: 'feo',
        user: userEmail,
        url: await getDownloadURL(fileref),
        likes: [
          ''
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

  votar(id:string, voto:Voto){
    // debugger;
    this.storeServ.updateVoto(id, this.authServ.usuarioActivo!.email, voto);
  }

  volver(){
    this.router.navigateByUrl('/home');
  }

  cerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl('/login'));
  }
  
  ngOnInit() {
    // debugger;
    this.storeServ.traerFotosPorTipo('feo').subscribe( (data) => {
      // console.log(data);
      this.fotosFeas = data;
    });
  }

}
