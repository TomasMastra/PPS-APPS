import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonRow, IonButton, IonImg, IonButtons } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButtons, IonImg, IonButton, IonRow, IonCol, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  private router:Router = inject(Router);
  private authServ:AuthService = inject(AuthService);
  constructor() {}

//  goTo(to:number){
//   let dest = '';
//   to == 0? dest = '/cosas-lindas': dest = '/cosas-feas';  
//   this.router.navigateByUrl(dest);
//  }
 goTo(to:string){
  // let dest = '';
  // to == 0? dest = '/cosas-lindas': dest = '/cosas-feas';  
  this.router.navigateByUrl(to);
 }

 cerrarSesion(){
  this.authServ.singOutUser().then(() => this.router.navigateByUrl('/login'));
 }




}

