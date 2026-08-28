import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly KEY_TEMA = 'modoEscuroAtivo';

  constructor() { }

  // Inicializa o tema ao abrir o aplicativo
  inicializarTema(): boolean {
    const temaSalvo = localStorage.getItem(this.KEY_TEMA);

    let modoEscuro = false;

    if (temaSalvo !== null) {
      // 1. Se o usuário já escolheu manualmente antes, usa a escolha dele
      modoEscuro = temaSalvo === 'true';
    } else {
      // 2. Se for a primeira vez, segue o modo do celular/sistema do usuário
      modoEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.aplicarTema(modoEscuro);
    return modoEscuro;
  }

  // Alterna o tema e salva a preferência
  alternarTema(modoEscuro: boolean) {
    this.aplicarTema(modoEscuro);
    localStorage.setItem(this.KEY_TEMA, String(modoEscuro));
  }

  // Aplica a classe .dark no corpo da página
  private aplicarTema(modoEscuro: boolean) {
    document.body.classList.toggle('dark', modoEscuro);
  }

  // Retorna se o modo escuro está ativo no momento
  isModoEscuro(): boolean {
    return document.body.classList.contains('dark');
  }
}