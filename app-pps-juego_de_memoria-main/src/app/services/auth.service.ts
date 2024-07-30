import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { UserModel } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth:Auth = inject(Auth);
  currentUser:UserModel | null = null; 
  constructor() { }

  async loginUser(email: string, password: string){
    try {
      const data = await signInWithEmailAndPassword(this.auth, email, password);
      let userCredential:UserModel = {
        id: 0,
        uid:data.user.uid,
        email: data.user.email!,
        role: '',
        sexo: 'No mucho'
      }
      this.currentUser = userCredential;
      localStorage.setItem("userCredential", JSON.stringify(userCredential!));
      // const userCredential = await lastValueFrom(this.storeService.traerUsuarioPorUid(data.user.uid));  
    } catch (error) {
      console.error("Error during login", error);
      throw error;
    }
  }

  async singOutUser(){
    return await signOut(this.auth)
      .then( res => {
        localStorage.removeItem("userCredential");
      });
  }

  get usuarioActivo():UserModel | null{
    return this.currentUser
  }
}
