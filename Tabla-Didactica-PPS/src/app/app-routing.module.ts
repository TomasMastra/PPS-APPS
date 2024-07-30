import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { AudiosComponent } from './audios/audios.component';



const routes: Routes = [
  { path: '', redirectTo: 'splash-screen', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'splash-screen', component: SplashScreenComponent },
  { path: 'audios', component: AudiosComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
