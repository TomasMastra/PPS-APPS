import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, deleteDoc, addDoc, collection, collectionData, doc, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, map, switchMap, take } from 'rxjs';
import { UserModel } from '../models/user';
import { FotosModel } from '../models/fotos';

type Voto = 'like' | 'dislike';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private db: Firestore = inject(Firestore);
  private users: CollectionReference;
  private relevamientos: CollectionReference;

  constructor(){
    this.users = collection(this.db, 'users');
    this.relevamientos = collection(this.db, 'relevamientos');
  }

  traerUsuarioPorUid(uid: string){
    let qry = query(this.users, where("uid", "==", uid));
    return collectionData(qry).pipe(
      map(users => users[0] as UserModel)
    );    
  }

  traerFotosPorUsuario(email: string){
    let qry = query(
      this.relevamientos, 
      where("user", "==", email),
      orderBy("date", 'desc'),
    );
    return collectionData(qry).pipe( map(fotos => fotos.map(foto => foto as FotosModel)));    
  }
  
  traerFotosPorTipo(tipo: string){
    let qry = query(
      this.relevamientos, 
      where("tipo", "==", tipo),
      orderBy("date", 'desc'),
    );
    return collectionData(qry).pipe( map(fotos => fotos.map(foto => foto as FotosModel)));    
    // return collectionData(qry) as Observable<FotosModel[]>;    
  }

  delete(foto: FotosModel): Promise<void> {
    const registro = doc(this.relevamientos, foto.refId!);  // Asegúrate de usar refId o el campo adecuado
    return deleteDoc(registro);
  }
  
  


    

  guardarFoto(foto:FotosModel){
    const row = doc(this.relevamientos);
    const idRef = row.id
    foto.refId = idRef;
    setDoc(row, foto);
  }

  traerFotoPorId(id:string){
    let qry = query(
      this.relevamientos, 
      where("refId", "==", id),
    );
    return collectionData(qry).pipe( map(fotos => fotos[0] as FotosModel)); 
  }

  updateVoto(id: string, user: string, voto: Voto) {
    this.traerFotoPorId(id).pipe(
      take(1),
      switchMap((foto) => {
        console.log(foto);
        if (voto === 'like') {
          if (foto.likes != undefined && !foto.likes.includes(user)) {
            foto.likes.push(user);
            const dislikeIndex = foto.dislikes.indexOf(user);
            if (dislikeIndex > -1) {
              foto.dislikes.splice(dislikeIndex, 1);
            }
          }
        } else if (voto === 'dislike') {
          if (foto.dislikes != undefined && !foto.dislikes.includes(user)) {
            foto.dislikes.push(user);
            const likeIndex = foto.likes.indexOf(user);
            if (likeIndex > -1) {
              foto.likes.splice(likeIndex, 1);
            }
          }
        }

        const fotoRef = doc(this.db, `relevamientos/${foto.refId}`);
        return setDoc(fotoRef, foto);
      })
    ).subscribe({
      next: () => console.log('Voto actualizado exitosamente'),
      error: (error) => console.error('Error al actualizar el voto:', error)
    });
  }


    

}
