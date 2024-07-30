import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';
import { QrscannerService } from '../services/qrscanner.service';
import { uploadString } from 'firebase/storage';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = null;
  userAuth: any = this.angularFireAuth.authState;
  pressedButton: boolean = false;

  scanActive: boolean = false;

  form: FormGroup;

  newUser: any = {};
  usersList: any[] = [];
  content: string[];
  userPhoto: string = '../../assets/user-default.png';

  isAdmin: boolean = false;
  formCreate: boolean = false;
  userList: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private qrScanner: QrscannerService,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private photoService: PhotoService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit(): void {
    this.pressedButton = true;
    this.form = this.formBuilder.group({
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      dni: ['', Validators.required],
      correo: ['', Validators.required],
      clave1: ['', Validators.required],
      clave2: ['', Validators.required],
    });
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.pressedButton = false;
        this.user = user;
        this.qrScanner.scanPrepare();
        this.userAuth = this.angularFireAuth.authState.subscribe((user) => {
          this.userAuth = user;
        });
        if (this.user.userRol == 'admin') {
          this.isAdmin = true;
          this.formCreate = true;
          this.userList = false;
        } else {
          this.isAdmin = false;
          this.formCreate = false;
          this.userList = true;
        }
      }
    });
    this.firestoreService.getUsers().subscribe((users) => {
      this.usersList = users;
      this.usersList.sort(this.orderByLastName);
    });


  } // end of ngOnInit

  logoutUser() {
    this.authService.signOut();
    setTimeout(() => {
      this.isAdmin = false;
      this.formCreate = false;
      this.userList = false;
    }, 2100);
  } // end of logoutUser

  startScan() {
    this.pressedButton = true;
    
    setTimeout(() => {
      this.pressedButton = false;
      this.scanActive = true;
      this.form.get('apellidos').setValue('Tomas');
      this.form.get('nombres').setValue('Mastrapasqua');
      this.form.get('dni').setValue('44668569');
      this.qrScanner.startScan().then((result) => {
        this.scanActive = false;
        const data = this.obtenerDatosDNI(result);

        this.content = result.split('@');        

        this.form.get('apellidos').setValue('Tomas');
        this.form.get('nombres').setValue('Mastrapasqua');
        this.form.get('dni').setValue('44668569');

        this.authService.toast('DNI escaneado', 'success');
        this.scanActive = false;


        this.authService.toast('DNI escaneado', 'success');
        this.scanActive = false;
      });
    }, 2000);
  } // end of startScan

  private obtenerDatosDNI(result:any){
    this.form.get('apellidos').setValue('Tomas');
    this.form.get('nombres').setValue('Mastrapasqua');
    this.form.get('dni').setValue('44668569');
    const informacion = result.ScanResult.split('@');
    const data = {
      nroTramite: informacion[0],
      apellido: informacion[1],
      nombre: informacion[2],
      genero: informacion[3],
      dni: informacion[4],
      ejemplar: informacion[5],
      fechaNacimiento: informacion[6],
      fechaVencimientoDni: informacion[7],
    }
    return data;
  }

  stopScan() {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
      this.scanActive = false;
      this.qrScanner.stopScanner();
    }, 2000);
  } // end of stopScan

  updateUser() {
    this.angularFirestore
      .doc<any>(`user/${this.userAuth.uid}`)
      .update({
        userCredit: this.user.userCredit,
        userEmail: this.user.userEmail,
        userId: this.user.userId,
        userName: this.user.userName,
        userQrCredit: this.user.userQrCredit,
        userRol: this.user.userRol,
        userSex: this.user.userSex,
      })
      .then(() => {})
      .catch((error) => {});
  } // end of updateUser

  createUser() {
    if (this.form.valid) {
      if (this.form.value.clave1 == this.form.value.clave2) {
        if (this.newUser.userPhoto) {
          this.newUser.userLastName = this.form.value.apellidos;
          this.newUser.userName = this.form.value.nombres;
          this.newUser.userDni = this.form.value.dni;
          this.newUser.userEmail = this.form.value.correo;
          this.newUser.userPassword = this.form.value.clave1;

          this.pressedButton = true;
          setTimeout(() => {
            this.authService
              .registerManagedUsers(this.newUser)
              .then(() => {
                this.form.reset();
                this.firestoreService.addUser(this.newUser);
                this.authService.toast(
                  '¡Usuario registrado con exito!',
                  'success'
                );
                this.userPhoto = '../../assets/user-default.png';
              })
              .catch((error) => {
                this.authService.toast(
                  this.authService.createMessage(error.code),
                  'danger'
                );
              });
            this.pressedButton = false;
          }, 2000);
        } else {
          this.authService.toast('Debes cargar una foto', 'warning');
        }
      } else {
        this.authService.toast('Las claves deben coincidir', 'warning');
      }
    } else {
      this.authService.toast(
        'Debes completar todos los campos y luego cargar una foto',
        'warning'
      );
    }
  } // end of createUser

  addPhotoToUser() {
    if (this.form.valid) {
      this.newUser = {
        userLastName: this.form.value.apellidos,
        userName: this.form.value.nombres,
        userDni: this.form.value.dni,
        userEmail: this.form.value.correo,
        userPassword: this.form.value.clave1,
        userPhoto: '',
      };

      this.pressedButton = true;
      setTimeout(() => {
        this.photoService.addNewToGallery(this.newUser).then((data) => {
          uploadString(data.storage, data.dataurl, 'data_url').then(() => {
            data.url.getDownloadURL().subscribe((url1: any) => {
              this.newUser.userPhoto = url1;
              this.userPhoto = url1;
              this.authService.toast('Foto Agregada!', 'success');
              this.pressedButton = false;
            });
          });
        });
      }, 2000);
    } else {
      this.authService.toast(
        'Primero debes completar todos los campos correctamente',
        'warning'
      );
    }
  } // end of addPhotoToUser

  orderByLastName(a: any, b: any) {
    if (a.userLastName > b.userLastName) {
      return 1;
    } else if (a.userLastName < b.userLastName) {
      return -1;
    } else {
      return 0;
    }
  } // end of orderByLastName

  goToUsersList() {
    this.pressedButton = true;
    setTimeout(() => {
      this.formCreate = false;
      this.userList = true;
      this.pressedButton = false;
    }, 2000);
  } // end of goToUsersList

  goToCreateUser() {
    this.pressedButton = true;
    setTimeout(() => {
      this.formCreate = true;
      this.userList = false;
      this.pressedButton = false;
    }, 2000);
  } // end of goToCreateUser
}
