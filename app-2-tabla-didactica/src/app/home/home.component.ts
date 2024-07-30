import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonImg, IonFabList, IonIcon, IonFabButton, IonFab } from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon, IonFabList, IonImg, IonItem, IonLabel, IonCol, IonRow, 
    IonGrid, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomeComponent implements OnInit {

  flags = ['España_flag.png', 'ReinoUnido_flag.png', 'Portugal_flag.png'];
  selectedFlag: string | null = null;
  selectedTema: string | null = null;
  showSpinner = false; // Propiedad para controlar la visibilidad del spinner
  numero: string;


  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { 
    this.numero = "5";
  }

  ngOnInit() {}

  cerrarSesion() {
    this.router.navigate(['login']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
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
