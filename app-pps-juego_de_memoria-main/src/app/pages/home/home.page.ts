import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonItem, IonImg, IonCol } from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { ScoreModel } from 'src/app/models/score';
import { UserModel } from 'src/app/models/user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonCol, IonImg, IonItem, IonRow, IonGrid, IonIcon, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, ReactiveFormsModule],
})
export class HomePage {
  private authServ:AuthService = inject(AuthService);
  private storeServ:StoreService = inject(StoreService);
  private router:Router = inject(Router);

  dificultad : string = '';
  cartasArray : any = []
  cartas : any = []
  seconds : number = 0;
  intervalId: any;
  aciertos : number = 0;
  cantidadPares : number = 0;
  tiempoJugador : any;

  animales = [
    {
      id:1,
      urlImagen:'../../../assets/cartas/animales/perro.png'
    },
    {
      id:2,
      urlImagen:'../../../assets/cartas/animales/tortuga-marina.png'
    },
    {
      id:3,
      urlImagen:'../../../assets/cartas/animales/delfin.png'
    },
    {
      id: 4,
      urlImagen: '../../../assets/cartas/animales/perro.png'
    },
    {
      id: 5,
      urlImagen: '../../../assets/cartas/animales/tortuga-marina.png'
    },
    {
      id: 6,
      urlImagen: '../../../assets/cartas/animales/delfin.png'
    }
  ]

  herramientas = [
    {
      id:1,
      urlImagen:'../../../assets/cartas/herramientas/llave-inglesa.png'
    },
    {
      id:2,
      urlImagen:'../../../assets/cartas/herramientas/martillo.png'
    },
    {
      id:3,
      urlImagen:'../../../assets/cartas/herramientas/pinzas-de-punta-de-aguja.png'
    },
    {
      id:4,
      urlImagen:'../../../assets/cartas/herramientas/serrucho.png'
    },
    {
      id:5,
      urlImagen:'../../../assets/cartas/herramientas/taladro.png'
    },
    {
      id: 6,
      urlImagen: '../../../assets/cartas/herramientas/llave-inglesa.png'
    },
    {
      id: 7,
      urlImagen: '../../../assets/cartas/herramientas/martillo.png'
    },
    {
      id: 8,
      urlImagen: '../../../assets/cartas/herramientas/pinzas-de-punta-de-aguja.png'
    },
    {
      id: 9,
      urlImagen: '../../../assets/cartas/herramientas/serrucho.png'
    },
    {
      id: 10,
      urlImagen: '../../../assets/cartas/herramientas/taladro.png'
    }
  ]

  frutas = [
    {
      id: 1,
      urlImagen: '../../../assets/cartas/frutas/banana.png'
    },
    {
      id: 2,
      urlImagen: '../../../assets/cartas/frutas/cereza.png'
    },
    {
      id: 3,
      urlImagen: '../../../assets/cartas/frutas/fresa.png'
    },
    {
      id: 4,
      urlImagen: '../../../assets/cartas/frutas/limon.png'
    },
    {
      id: 5,
      urlImagen: '../../../assets/cartas/frutas/manzana.png'
    },
    {
      id: 6,
      urlImagen: '../../../assets/cartas/frutas/naranja.png'
    },
    {
      id: 7,
      urlImagen: '../../../assets/cartas/frutas/pera.png'
    },
    {
      id: 8,
      urlImagen: '../../../assets/cartas/frutas/sandia.png'
    },
    {
      id: 9,
      urlImagen: '../../../assets/cartas/frutas/banana.png'
    },
    {
      id: 10,
      urlImagen: '../../../assets/cartas/frutas/cereza.png'
    },
    {
      id: 11,
      urlImagen: '../../../assets/cartas/frutas/fresa.png'
    },
    {
      id: 12,
      urlImagen: '../../../assets/cartas/frutas/limon.png'
    },
    {
      id: 13,
      urlImagen: '../../../assets/cartas/frutas/manzana.png'
    },
    {
      id: 14,
      urlImagen: '../../../assets/cartas/frutas/naranja.png'
    },
    {
      id: 15,
      urlImagen: '../../../assets/cartas/frutas/pera.png'
    },
    {
      id: 16,
      urlImagen: '../../../assets/cartas/frutas/sandia.png'
    }
  ]


  constructor() {}
  
  ngOnInit() {

  }
  jugar(id:number){    
    
    const element = document.getElementById(id.toString());

    element!.classList.toggle('flipped');

    let carta1 = this.cartas.find((a: { id: number; })=> a.id == id);

    if(this.cartasArray.length == 0){
      this.cartasArray.push(carta1);

    }else{
      const esta = this.cartasArray.find((a: { urlImagen: string | undefined; }) => a.urlImagen == carta1?.urlImagen);
      const repetida = this.cartasArray.find((a: { id: number; }) => a.id == id);

      if(repetida){
        this.cartasArray = [];
        return
      }

      const idCarta1 = this.cartasArray[0].id;
      const element1 = document.getElementById(idCarta1.toString());

      const element2 = document.getElementById(id.toString());
      if(!esta){ 
        setTimeout(() => {
          element1!.classList.toggle('flipped');
          element2!.classList.toggle('flipped');
        }, 1000);

      }else{        
        
        element1!.parentNode?.removeAllListeners!();
        element2!.parentNode?.removeAllListeners!();
        this.aciertos++;
        if(this.aciertos == this.cantidadPares){
          this.tiempoJugador = this.formatTime();
          clearInterval(this.intervalId);                  
          setTimeout(() => {
            this.win()
          }, 1000);
        }
      }

      this.cartasArray = [];
    }
  }

  elegirNivel(nivel : number){
    switch (nivel) {
      case 0:
        this.aciertos = 0;
        this.cantidadPares = 0;
        this.stopTimer();
        this.dificultad = '';
        this.cartas = [];
        break;

      case 1:        
        this.dificultad = 'Facil';
        this.cantidadPares = 3;
        this.cartas = this.animales;
        this.cartas.sort(()=> Math.random() - 0.5);
        this.startTimer()
        break;
      
      case 2:
        this.dificultad = 'Medio';
        this.cantidadPares = 5;
        this.cartas = this.herramientas;
        this.cartas.sort(()=> Math.random() - 0.5);
        this.startTimer()
        break;
      
      case 3:
        this.dificultad = 'Dificil';
        this.cantidadPares = 8;
        this.cartas = this.frutas;
        this.cartas.sort(()=> Math.random() - 0.5);
        this.startTimer()
        break;
    }
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    this.seconds++;
  }

  formatTime() {
    const minutes = Math.floor(this.seconds / 60);
    const remainingSeconds = this.seconds % 60;
    return `${this.padTime(minutes)}:${this.padTime(remainingSeconds)}`;
  }

  padTime(time: number) {
    return time < 10 ? `0${time}` : time;
  }

  stopTimer(){
    this.seconds = 0;
    clearInterval(this.intervalId);
  }

  win(){
    Swal.fire({
      title: '¡¡Ganaste!!',
      text: `Tu tiempo fue de: ${this.tiempoJugador}`,
      confirmButtonText: "Elegir otra dificultad",
      confirmButtonColor: '#7e34bc',
      background: '#80b97d',
      color: '#FFFFFF',
      heightAuto:false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarDatos()
        this.elegirNivel(0);
        this.stopTimer();
      }else{
        this.stopTimer();
        this.elegirNivel(0)
        this.elegirNivel(1);
      }
    });
  }

  guardarDatos(){
    const player:UserModel = this.authServ.usuarioActivo!;

    const nuevoScore:ScoreModel = <ScoreModel>{
        uid: player.uid,
        user: player.email,
        score: this.seconds.toString(),
        tiempo: this.tiempoJugador,
        dificultad: this.dificultad,
        date: new Date()
    }
    this.storeServ.guardarScore(nuevoScore);
    
  }

  public cerrarSesion(){
    this.authServ.singOutUser().then(() => this.router.navigateByUrl("/login"));
  }

  goTo(to:string){
    this.router.navigateByUrl(to);
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
}