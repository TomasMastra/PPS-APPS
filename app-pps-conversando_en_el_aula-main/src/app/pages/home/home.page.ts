import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFab, IonImg, IonFabList, IonFabButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFabList, IonImg, IonFab, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink, CommonModule, ReactiveFormsModule],
})
export class HomePage {
  private authServ:AuthService = inject(AuthService);
  private router:Router = inject(Router);

  constructor() {}

  cerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl('/login'));
  }
  goTo(to:string){
    this.router.navigateByUrl(to);
  }
}
