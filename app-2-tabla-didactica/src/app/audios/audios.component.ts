import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonImg, IonFabList, IonIcon, IonFabButton, IonFab, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-audios',
  templateUrl: './audios.component.html',
  styleUrls: ['./audios.component.scss'],
  standalone: true,
  imports: [IonButton, IonFab, IonFabButton, IonIcon, IonFabList, IonImg, IonItem, IonLabel, IonCol, IonRow, 
    IonGrid, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class AudiosComponent implements OnInit {

  flag: string | null = null;
  tema: string | null = null;
  audioFiles: string[] = [];
  image: string[] = [];
  background = null;
  audioPlayer: HTMLAudioElement | null = null; 

  flags = ['España_flag.png', 'ReinoUnido_flag.png', 'Portugal_flag.png'];
  selectedFlag: string | null = null;
  selectedTema: string | null = null;
  showSpinner = false; // Propiedad para controlar la visibilidad del spinner
  selectedImgFlag: string = '../../assets/espana.png';
  selectedImgTema: string = '../../assets/colores.png';
  index: number = 0;


  myArray: string[] = [
    'Platzi',
    'es',
    'genial!'
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
 
    this.isSelected('flag', 'Espania');
    this.selectImage('flag', 'Espania');

    this.isSelected('tema', 'Animal');
    this.selectImage('tema', 'Animal');
    this.route.queryParams.subscribe(params => {
      this.flag = params['flag'];
      this.tema = params['tema'];
      this.loadAudioFiles();
    });
  }

  loadAudioFiles() {
    if (this.flag && this.tema) {
      switch (this.tema) {
        case 'Animal':
          this.audioFiles = this.getAudioFiles(this.flag, 'animales');
          break;
        case 'Color':
          this.audioFiles = this.getAudioFiles(this.flag, 'colores');
          break;
        case 'Numero':
          this.audioFiles = this.getAudioFiles(this.flag, 'numeros');
          break;
      }
    }
  }

  getAudioFiles(flag: string, tema: string): string[] {
    const basePath = `assets/audios/${flag.toLowerCase()}/${tema}`;
    const fileNames = this.getFileNamesForTema(tema);

    return fileNames.map(fileName => `${basePath}/${fileName}`);
  }

  getFileNamesForTema(tema: string): string[] {
    switch (tema) {
      case 'animales':
        this.image = ['🦓','🐷','🐘','🐔','🦛','🦒'/*,'🦁','🐒','🐯','🦜'*/]
        return ['cebra.mp3', 'chancho.mp3', 'elefante.mp3', 'gallina.mp3', 'hipopotamo.mp3', 'jirafa.mp3'/*, 'leon.mp3', 'mono.mp3', 'tigre.mp3', 'tucan.mp3'*/];
      case 'colores':
        this.image = ['💛','💙','❤️','💚','💜','🧡'/*,'🖤','🩶','🩷','🩵','🤍'*/]
        return ['amarillo.mp3', 'azul.mp3', 'rojo.mp3', 'verde.mp3', 'violeta.mp3', 'naranja.mp3'/*, 'negro.mp3', 'gris.mp3', 'rosa.mp3', 'celeste.mp3', 'blanco.mp3'*/];
      case 'numeros':
        this.image = [/*'0️⃣',*/'1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣'/*,'7️⃣','8️⃣','9️⃣'*/]
        return [/*'0.mp3', */'1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3'/*, '7.mp3', '8.mp3', '9.mp3'*/];
      default:
        return [];
    }
  }

  playAudio(audioFile: string) {
    if (this.audioPlayer) {
      this.audioPlayer.pause(); // Pausar la reproducción actual si hay una
    }
    this.audioPlayer = new Audio(audioFile); // Crear un nuevo reproductor de audio
    this.audioPlayer.play(); // Reproducir el audio seleccionado
  }

  goTo() {
    this.router.navigate(['home']);
  }

  selectImage(type: string, value: string) {
    if (type === 'flag') {
      if (this.selectedFlag === value) {
        this.selectedFlag = null; // Deseleccionar si ya está seleccionado
      } else {
        this.selectedFlag = value; // Seleccionar si no está seleccionado
      }
    } else if (type === 'tema') {
      if (this.selectedTema === value) {
        this.selectedTema = null; // Deseleccionar si ya está seleccionado
      } else {
        this.selectedTema = value; // Seleccionar si no está seleccionado
      }
    }

    if (this.selectedFlag) {
      if (this.selectedFlag === 'Espania') {
        this.selectedImgFlag = '../../assets/espana.png';
      } else if (this.selectedFlag === 'ReinoUnido') {
        this.selectedImgFlag = '../../assets/reino-unido.png';
      } else if (this.selectedFlag === 'Portugal') {
        this.selectedImgFlag = '../../assets/portugal.png';
      }
    } 
     if (this.selectedTema) {
      if (this.selectedTema === 'Color') {
        this.selectedImgTema = '../../assets/colores.png';
      } else if (this.selectedTema === 'Numero') {
        this.selectedImgTema = '../../assets/uno.png';
      } else if (this.selectedTema === 'Animal') {
        this.selectedImgTema = '../../assets/elefante.png';
      }
    } else {
      this.selectedImgTema = '../../assets/a.png'; // Imagen por defecto si no hay selección
    }

    this.irAudios();
  } 

  isSelected(type: string, value: string): boolean {
    if (type === 'flag') {
      return this.selectedFlag === value;
    } else if (type === 'tema') {
      return this.selectedTema === value;
    }
    return false;
  }

  irAudios() {
    if (this.selectedFlag !== null && this.selectedTema !== null) {
      this.showSpinner = true; // Mostrar el spinner antes de navegar
      //setTimeout(() => {
        this.router.navigate(['audios'], { queryParams: { flag: this.selectedFlag, tema: this.selectedTema } });
        this.showSpinner = false; // Ocultar el spinner después de navegar
      //}, 2000);
    } else {
      console.log("Por favor, seleccione un idioma y un tema.");
    }
  }


}