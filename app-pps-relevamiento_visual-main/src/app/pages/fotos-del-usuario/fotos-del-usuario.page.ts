import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonFab, IonImg, IonFabButton, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonButton, IonGrid, IonCol, IonRow, IonLabel, IonItem, IonText, IonFooter, IonButtons } from '@ionic/angular/standalone';
import { StoreService } from 'src/app/services/store.service';
import { AuthService } from 'src/app/services/auth.service';
import { FotosModel } from 'src/app/models/fotos';
import { Router } from '@angular/router';

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
    });
  }
}
