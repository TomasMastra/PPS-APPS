import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButtons, IonButton, IonInput, IonFab, IonFabButton, IonImg, IonCol, IonRow, IonLabel, IonItem, IonText, IonTextarea } from '@ionic/angular/standalone';
import { MensajeModel } from 'src/app/models/mensaje';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';
import { UserModel } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-b',
  templateUrl: './chat-b.page.html',
  styleUrls: ['./chat-b.page.scss'],
  standalone: true,
  imports: [
    IonTextarea, IonText, IonItem, IonLabel, IonRow, IonCol, IonImg, IonFabButton, IonFab, IonInput, IonButton, IonButtons, IonFooter, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class ChatBPage implements OnInit {
  private authServ:AuthService = inject(AuthService);
  private storeServ:StoreService = inject(StoreService);
  private router:Router = inject(Router);
  private currentUser!: UserModel;
  aula:string = 'pps-b'
  mensajes:MensajeModel[] = [];
  sendMensaje:string = '';
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor() { }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 10);
  }

  determinarClaseMensaje(message: MensajeModel): string {
    return message.uid === this.currentUser.uid ? 'send' : 'received';
  }

  determinarUsuarioMensaje(message: MensajeModel): boolean {
    return message.uid === this.currentUser.uid ? true : false;
  }

  enviarMensaje(){
    if(this.sendMensaje != ''){
      const nuevoMensaje:MensajeModel = <MensajeModel>{
        uid: this.currentUser.uid,
        user: this.currentUser.email,
        text: this.sendMensaje,
        date: new Date(),
        aula: this.aula
      }
      this.storeServ.guardarMensajes(nuevoMensaje);
      setTimeout(() => {
        this.sendMensaje = "";
        this.scrollToBottom();
      }, 10);
    }
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

  volver(){
    this.router.navigateByUrl('/home');
  }
  cerrarSesion(){
    this.authServ.singOutUser().then( () => this.router.navigateByUrl('/login'));
  }


  ngOnInit() {
    this.currentUser = this.authServ.usuarioActivo!;

    this.storeServ.cargarMensajes(this.aula).subscribe( (data) => {
      this.mensajes = data;
      console.log(this.mensajes);
      this.scrollToBottom();
    });
  }

}
