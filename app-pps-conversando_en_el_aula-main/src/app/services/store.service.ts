import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, map, switchMap, take } from 'rxjs';
import { UserModel } from '../models/user';
import { MensajeModel } from '../models/mensaje';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private db: Firestore = inject(Firestore);
  private users: CollectionReference;
  private mensajes: CollectionReference;

  constructor(){
    this.users = collection(this.db, 'users');
    this.mensajes = collection(this.db, 'mensajes');
  }

  traerUsuarioPorUid(uid: string){
    let qry = query(this.users, where("uid", "==", uid));
    return collectionData(qry).pipe(
      map(users => users[0] as UserModel)
    );    
  }

  guardarMensajes(mensaje: MensajeModel){
    if(mensaje){
      addDoc(this.mensajes, mensaje)
      .then((res) => {
        console.log(res);
      }).catch( (e) =>{
        console.log(e);
      });
    }
  }
  

  cargarMensajes(aula:string) {
    const qry = query(
      this.mensajes,
      where('aula', '==', aula),
      orderBy('date', 'asc'));
    return collectionData(qry) as Observable<MensajeModel[]>;
  }


}
