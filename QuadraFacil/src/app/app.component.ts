import { Component, Optional } from '@angular/core';
import { Platform, NavController, IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet] // <-- Adicionado IonApp aqui
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private navController: NavController,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
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