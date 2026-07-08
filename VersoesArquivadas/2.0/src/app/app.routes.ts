import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'esqueceu-senha',
    loadComponent: () => import('./pages/esqueceu-senha/esqueceu-senha.page').then(m => m.EsqueceuSenhaPage)
  },
  {
    path: 'app',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'main',
        loadComponent: () => import('./pages/main/main.page').then(m => m.MainPage)
      },
      {
        path: 'pesquisar',
        loadComponent: () => import('./pages/pesquisar/pesquisar.page').then(m => m.PesquisarPage)
      },
      {
        path: 'conta',
        loadComponent: () => import('./pages/conta/conta.page').then(m => m.ContaPage)
      },
      {
        path: 'meu-perfil',
        loadComponent: () => import('./pages/meu-perfil/meu-perfil.page').then(m => m.MeuPerfilPage)
      },
      {
        path: 'minhas-quadras',
        loadComponent: () => import('./pages/minhas-quadras/minhas-quadras.page').then(m => m.MinhasQuadrasPage)
      },
      {
        path: 'meus-amigos',
        loadComponent: () => import('./pages/meus-amigos/meus-amigos.page').then(m => m.MeusAmigosPage)
      },
      {
        path: 'criar-quadra',
        loadComponent: () => import('./pages/criar-quadra/criar-quadra.page').then(m => m.CriarQuadraPage)
      },
      {
        path: 'quadras-pendentes',
        loadComponent: () => import('./pages/quadras-pendentes/quadras-pendentes.page').then(m => m.QuadrasPendentesPage)
      },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  },



];