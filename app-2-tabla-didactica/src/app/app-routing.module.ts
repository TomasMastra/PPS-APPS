import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { AudiosComponent } from './audios/audios.component';



const routes: Routes = [
  { path: '', redirectTo: 'splash-screen', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'splash-screen', component: SplashScreenComponent },
  { path: 'audios', component: AudiosComponent },
  // Mantén la ruta para el componente Tab1
  { path: 'tabs/tab1', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  // Otras rutas aquí
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
