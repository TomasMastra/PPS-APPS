import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) {}

  createMonthlyControl(control: any) {
    return this.angularFirestore
      .collection<any>('controlesMensuales')
      .add(control)
      .then((data) => {
        this.angularFirestore
          .collection('controlesMensuales')
          .doc(data.id)
          .set({
            id: data.id,
            ...control,
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  getMonthlyControls(uid: number) {
    const collection = this.angularFirestore.collection<any>(
      'controlesMensuales',
      (ref) => ref.where('userUid', '==', uid)
    );
    return collection.valueChanges();
  }

  async updateControl(control: any) {
    await this.angularFirestore
      .doc<any>(`controlesMensuales/${control.id}`)
      .update(control)
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
      });
  } // end of updateUser
}
