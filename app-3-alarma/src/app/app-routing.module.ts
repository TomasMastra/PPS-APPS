import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { AlarmButtonComponent } from './alarm-button/alarm-button.component';
const routes: Routes = [
  { path: '', redirectTo: 'splash-screen', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'splash-screen', component: SplashScreenComponent },
  { path: 'alarma', component: AlarmButtonComponent },

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
