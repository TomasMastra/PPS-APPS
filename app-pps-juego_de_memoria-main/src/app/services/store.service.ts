import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData, doc, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, map, switchMap, take } from 'rxjs';
import { UserModel } from '../models/user';
import { ScoreModel } from '../models/score';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private db: Firestore = inject(Firestore);
  private users: CollectionReference;
  private scores: CollectionReference;

  constructor(){
    this.users = collection(this.db, 'users');
    this.scores = collection(this.db, 'scores');
  }

  traerUsuarioPorUid(uid: string){
    let qry = query(this.users, where("uid", "==", uid));
    return collectionData(qry).pipe(
      map(users => users[0] as UserModel)
    );    
  }
  guardarScore(score:ScoreModel){
    const row = doc(this.scores);
    const idRef = row.id
    score.id = idRef;
    setDoc(row, score);
  }

  traerTopScorePorDificultad(dificultad: string){
    let qry = query(
      this.scores, 
      where("dificultad", "==", dificultad),
      orderBy("score", 'desc'),
      limit(5)
    );
    return collectionData(qry).pipe( map(scores => scores.map(score => score as ScoreModel)));    
  }
  
  // traerFotosPorTipo(tipo: string){
  //   let qry = query(
  //     this.relevamientos, 
  //     where("tipo", "==", tipo),
  //     orderBy("date", 'desc'),
  //   );
  //   return collectionData(qry).pipe( map(fotos => fotos.map(foto => foto as FotosModel)));    
  //   // return collectionData(qry) as Observable<FotosModel[]>;    
  // }

  // guardarFoto(foto:FotosModel){
  //   const row = doc(this.relevamientos);
  //   const idRef = row.id
  //   foto.refId = idRef;
  //   setDoc(row, foto);
  // }

  // traerFotoPorId(id:string){
  //   let qry = query(
  //     this.relevamientos, 
  //     where("refId", "==", id),
  //   );
  //   return collectionData(qry).pipe( map(fotos => fotos[0] as FotosModel)); 
  // }

  // updateVoto(id: string, user: string, voto: Voto) {
  //   this.traerFotoPorId(id).pipe(
  //     take(1),
  //     switchMap((foto) => {
  //       console.log(foto);
  //       if (voto === 'like') {
  //         if (foto.likes != undefined && !foto.likes.includes(user)) {
  //           foto.likes.push(user);
  //           const dislikeIndex = foto.dislikes.indexOf(user);
  //           if (dislikeIndex > -1) {
  //             foto.dislikes.splice(dislikeIndex, 1);
  //           }
  //         }
  //       } else if (voto === 'dislike') {
  //         if (foto.dislikes != undefined && !foto.dislikes.includes(user)) {
  //           foto.dislikes.push(user);
  //           const likeIndex = foto.likes.indexOf(user);
  //           if (likeIndex > -1) {
  //             foto.likes.splice(likeIndex, 1);
  //           }
  //         }
  //       }

  //       const fotoRef = doc(this.db, `relevamientos/${foto.refId}`);
  //       return setDoc(fotoRef, foto);
  //     })
  //   ).subscribe({
  //     next: () => console.log('Voto actualizado exitosamente'),
  //     error: (error) => console.error('Error al actualizar el voto:', error)
  //   });
  // }

}
