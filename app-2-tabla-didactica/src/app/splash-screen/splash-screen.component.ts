import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent  implements OnInit {

  constructor(private router: Router) { 
    this.ionViewWillEnter(); // Llama a ionViewWillEnter() al inicializar el componente
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    setTimeout(()=>{
      this.router.navigateByUrl('login');
    }, 1500)
  }

  navegarLogin()
  {
    this.router.navigate(['login']);

  }

}
