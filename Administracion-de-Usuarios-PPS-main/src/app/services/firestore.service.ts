import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  usersCollectionReference: any;
  users: Observable<any>;
  usersList: any = [];

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage
  ) {
    this.usersCollectionReference =
      this.angularFirestore.collection<any>('managedUsers');
    this.users = this.usersCollectionReference.valueChanges({ idField: 'id' });
    this.getUsers().subscribe((users) => {
      this.usersList = users;
    });
  }

  addUser(user: any) {
    this.usersCollectionReference.add({ ...user });
  }

  getUsers() {
    return this.users;
  }

  deleteAllUsers() {
    return this.angularFirestore.collection('managedUsers').get().pipe(
      switchMap(snapshot => {
        // Create an observable that deletes each document
        const deleteObservables = snapshot.docs.map(doc => {
          return from(this.angularFirestore.collection('managedUsers').doc(doc.id).delete());
        });
        // Execute all deletions in parallel
        return from(Promise.all(deleteObservables.map(obs => obs.toPromise())));
      })
    );
  }
}
