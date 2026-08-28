import { Component, Optional } from '@angular/core';
import { Platform, NavController, IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { ThemeService } from './services/theme.service'; // <-- Importado

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private navController: NavController,
    private themeService: ThemeService, // <-- Injetado
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    // 1. Inicializa o Modo Claro/Escuro de acordo com a preferência
    this.themeService.inicializarTema();

    // 2. Configura o botão físico de voltar
    this.configurarBotaoVoltar();
  }

  configurarBotaoVoltar() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const urlAtual = window.location.pathname;

      // Se estiver nas abas principais ou no Login, minimiza o app
      if (
        urlAtual.includes('/login') || 
        urlAtual.includes('/app/main') || 
        urlAtual.includes('/app/conta') || 
        urlAtual.includes('/app/pesquisar') ||
        urlAtual === '/'
      ) {
        App.minimizeApp();
      } 
      // Se puder voltar no histórico, volta suavemente
      else if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.navController.back();
      } 
      // Caso contrário, força o retorno
      else {
        this.navController.back();
      }
    });
  }
}