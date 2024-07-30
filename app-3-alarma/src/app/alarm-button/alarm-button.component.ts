import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { Haptics } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-alarm-button',
  templateUrl: './alarm-button.component.html',
  styleUrls: ['./alarm-button.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class AlarmButtonComponent implements OnInit {

  public activado : boolean = false;
  accelerationX:any = 'Aceleracion X';
  accelerationZ:any = 'Aceleracion Z';
  accelerationY:any = 'Aceleracion Y';

  alarmOnOff: boolean = false;
  showDialog: boolean = false;

  primerIngreso: boolean = true;
  primerIngresoFlash: boolean = true;
 
  posicionActualCelular = 'actual';
  posicionAnteriorCelular = 'anterior'; 
  
  subscription: any;

  //Sonidos
  audioIzquierda = "../../assets/audio1.ogg";
  audioDerecha = "../../assets/audio2.ogg";
  audioVertical = "../../assets/audio3.ogg ";
  audioHorizontal = "../../assets/audio4.ogg";
  audioError = "../../assets/alarma.mp3";
  audio = new Audio();
  
  constructor(private router: Router) {
    
  }
  
  onoff(){

      this.audio.src = this.audioVertical;
      this.audio.play();
    if(this.activado){
      this.verificarClave();
    }else{
      this.activarAlarma();
    }    
  }

  playAudio(audio: HTMLAudioElement) {
    audio.play().catch(error => {
      console.error('Error al reproducir el audio:', error);
      this.playAudio(audio);

    });
  }


  async cerrarSesion(){

    Swal.fire({
      title: 'Ingrese su clave',
      input: 'password',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#5a5b60',
      background: '#5a5b60',
      color: '#FFFFFF',
      heightAuto: false,
    }).then((result) => {
      if(result.value == '111111'){
            this.activado = false;
            this.router.navigate(['/login']);
            this.parar();
          
      }
    });



    
  }
  
  async showVerificarClave(){
    const { value } = await Swal.fire({
      title: 'Ingrese su clave',
      input: 'password',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#bf2dac',
      background: '#74bcff',
      color: '#bf2dac',
      heightAuto: false,
    });
    Swal.close();

  }

  async verificarClave(){

    Swal.fire({
      title: 'Ingrese su clave',
      input: 'password',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#5a5b60',
      background: '#5a5b60',
      color: '#FFFFFF',
      heightAuto: false,
    }).then((result) => {
      if(result.value == '111111'){
          this.activado = false;
          this.audio.pause();
          this.parar();
        

      }else{      
        this.errorApagado();
      }
    });



  }

  activarAlarma() {
    Motion.addListener('orientation', (event) => {
      if (event.gamma > 45) {
        this.posicionActualCelular = 'derecha';
        this.movimientoDerecha();
      } 
      else if (event.gamma < -45) {
        this.posicionActualCelular = 'izquierda';
        this.movimientoIzquierda();
      } 
      else if (event.beta >= 60) {
        this.posicionActualCelular = 'arriba';
        if (this.posicionActualCelular != this.posicionAnteriorCelular) {
          this.audio.src = this.audioVertical;
          this.posicionAnteriorCelular = 'arriba';
        }
        this.audio.play();
        this.movimientoVertical();
      } 
      else if (event.gamma < 10 && this.posicionActualCelular == 'arriba') {

        this.posicionActualCelular = 'plano';
        this.movimientoHorizontal();
      }
    });
    this.activado = true;
  }

  movimientoIzquierda() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular != this.posicionAnteriorCelular) {
      this.posicionAnteriorCelular = 'izquierda';
      this.audio.src = this.audioIzquierda;
    }
    this.audio.play();
  }

  movimientoDerecha() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular != this.posicionAnteriorCelular) {
      this.posicionAnteriorCelular = 'derecha';
      this.audio.src = this.audioDerecha;
    }
    this.audio.play();
  }

  movimientoVertical() {
    if (this.primerIngresoFlash) {
      this.primerIngresoFlash ? CapacitorFlash.switchOn({}) : null;
      setTimeout(() => {
        this.primerIngresoFlash = false;
        CapacitorFlash.switchOff();
      }, 5000);
      this.primerIngreso = false;
    }
  }

  movimientoHorizontal() {
    if (this.posicionActualCelular != this.posicionAnteriorCelular) {
      this.posicionAnteriorCelular = 'plano';
      this.audio.src = this.audioHorizontal;
    }
    if (!this.primerIngreso) {
      this.audio.play();
      Haptics.vibrate({ duration: 5000 });
    }
    this.primerIngreso = true;
    this.primerIngresoFlash = true;
  }

  errorApagado() {
    Motion.removeAllListeners();
    this.audio.src = "../../assets/alarma-robo.mp3";
    this.audio.play();
    CapacitorFlash.switchOn({})
    Haptics.vibrate({duration: 5000});
    setTimeout(() => {
      this.primerIngresoFlash = false;
      CapacitorFlash.switchOff();
      this.activarAlarma();
    }, 5000);
  }

  parar() {    
    this.primerIngreso = true;
    this.activado = false;
    Motion.removeAllListeners();
  }

  vibracion(){
    Haptics.vibrate({duration: 5000});    
  }

  ngOnInit(): void { }
}
