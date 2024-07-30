import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'splash-screen',
    loadComponent: () => import('./pages/splash-screen/splash-screen.page').then( m => m.SplashScreenPage)
  },
  {
    path: 'chat-a',
    loadComponent: () => import('./pages/chat-a/chat-a.page').then( m => m.ChatAPage)
  },
  {
    path: 'chat-b',
    loadComponent: () => import('./pages/chat-b/chat-b.page').then( m => m.ChatBPage)
  },
];
