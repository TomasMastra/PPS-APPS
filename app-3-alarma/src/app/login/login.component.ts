import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IonContent, IonHeader, IonTitle, IonToolbar, IonicSlides, IonRow, IonCol, IonButton, IonToast, IonIcon, IonItem, IonInput, IonImg } from '@ionic/angular/standalone';
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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonImg, IonInput, IonIcon, IonToast, IonButton, IonCol, IonItem,
    IonRow, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, CommonModule
    ]
})
export class LoginComponent   {

  public nombre:string;
  public mail:string;
  public password:string;
  public estado1: boolean = false;
  public estado2: boolean = false;
  public estado3: boolean = false;

  imagen1: string = '../../assets/encender.png';
  imagen2: string = '../../assets/encender.png';
  imagen3: string = '../../assets/encender.png';

  click = "../../assets/click.mp3";
  audio = new Audio();


  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    this.nombre = "";
    this.mail = "";
    this.password = "";
  }

  ngOnInit() {}

  crearUsuario()
  {
    this.router.navigate(['/register']);
  }


  async iniciarSesion() {
    // Assuming you have email and password collected from the form
    const mailInput = document.getElementById('mail') as HTMLInputElement;
    const passwordInput = document.getElementById('contraseña') as HTMLInputElement;
  
    const mail = mailInput.value.trim(); 
    const password = passwordInput.value.trim();

    /*this.audio.src = this.click;   
    this.audio.play();*/
  
    try {
      //const result = await this.afAuth.signInWithEmailAndPassword(mail, password);
      this.router.navigate(['/alarma']);
      //return result;
      return 1;
    } catch (error) {
      // Optionally, show an alert or a toast with the error message
      //alert('Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.');
      return null;
    }
  }

  autoCompletar(mail: string, password: string) {
    const emailInput = document.getElementById("mail") as HTMLInputElement;
    const passwordInput = document.getElementById("contraseña") as HTMLInputElement;


    if (emailInput && passwordInput) {
      emailInput.value = mail;
      passwordInput.value = password;
    } else {
      console.error('Email or password input element not found');
    }

    if(mail == 'admin@admin.com'){
      this.estado1 = true;
      this.estado1 = false;
      this.estado1 = false;

    }
  }

  cambiarImagen(imagen: number) {

    switch(imagen){
      case 1:
        if (this.imagen1 === '../../assets/encender.png') {
          this.imagen1 = '../../assets/apagar.png';
          this.imagen2 = '../../assets/encender.png';
          this.imagen3 = '../../assets/encender.png';
          this.audio.src = this.click;   
          this.audio.play();
        } else {
          this.imagen1 = '../../assets/encender.png';

          this.audio.src = this.click;   
          this.audio.play();
        }
      break;

      case 2:
        if (this.imagen2 === '../../assets/encender.png') {
          this.imagen2 = '../../assets/apagar.png';
          this.imagen1 = '../../assets/encender.png';
          this.imagen3 = '../../assets/encender.png';

        this.audio.src = this.click;   
        this.audio.play();
        } else {
          this.imagen2 = '../../assets/encender.png';
          this.audio.src = this.click;   
          this.audio.play();
        }
      break;

      case 3:
        if (this.imagen3 === '../../assets/encender.png') {
          this.imagen3 = '../../assets/apagar.png';
          this.imagen1 = '../../assets/encender.png';
          this.imagen2 = '../../assets/encender.png';
          this.audio.src = this.click;   
          this.audio.play();
        } else {
          this.imagen3 = '../../assets/encender.png';
          this.audio.src = this.click;   
          this.audio.play();
        }
      break;
    }

  }
  

}
