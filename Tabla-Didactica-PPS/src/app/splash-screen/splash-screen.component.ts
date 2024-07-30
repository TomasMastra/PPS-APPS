import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonRow, IonApp, IonCol, IonItem, IonFabButton, IonImg, IonButton, IonFabList, IonFab, IonButtons, IonMenu, IonMenuButton, IonInput, IonList, IonLabel, IonAvatar, IonToggle, IonMenuToggle, IonText, IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  imports: [IonToast, IonText, IonToggle, IonAvatar, IonLabel, IonIcon, IonList, IonApp, IonInput, IonButtons, IonFab, IonFabList, IonButton, IonImg, IonFabButton, IonMenu, IonItem, IonCol, IonRow, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonMenuToggle]

})
export class SplashScreenComponent  implements OnInit {

  constructor(private router: Router) { 
    this.ionViewWillEnter(); 
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }
  ionViewWillEnter(){
    setTimeout(()=>{
      this.router.navigate(['/login']);
    }, 1500)
  }

  navegarLogin()
  {
    this.router.navigate(['login']);
  }

}
