import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SplashScreenPage implements OnInit {
  private router: Router = inject(Router);

  constructor() { 
    setTimeout( () => {
      this.router.navigateByUrl('/login');
    }, 2850);
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      SplashScreen.hide({fadeOutDuration: 500}); //500
    }, 100); //100
  }
}