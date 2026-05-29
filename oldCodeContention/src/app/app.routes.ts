import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cadastro',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'conta',
    loadComponent: () => import('./pages/conta/conta.page').then( m => m.ContaPage)
  },
  {
    path: 'meu-perfil',
    loadComponent: () => import('./pages/meu-perfil/meu-perfil.page').then( m => m.MeuPerfilPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },


];
