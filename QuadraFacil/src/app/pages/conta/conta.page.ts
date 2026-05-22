import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
         IonIcon, IonList, IonItem, IonLabel, IonTabBar, IonTabButton,
         NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, mapOutline, personOutline, warningOutline,
         notificationsOutline, arrowForwardOutline, homeOutline,
         searchOutline } from 'ionicons/icons';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
  standalone: true,
  imports: [IonTabButton, IonTabBar, IonLabel, IonItem, IonList, IonIcon,
            IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, IonContent, CommonModule]
})
export class ContaPage {

  usuario: UsuarioModel | null = null;

  constructor(private usuarioService: UsuarioService, private navController: NavController) {
    addIcons({ addOutline, mapOutline, personOutline, warningOutline,
               notificationsOutline, arrowForwardOutline, homeOutline, searchOutline });
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obterSessao();
    if (!this.usuario) this.navController.navigateRoot('/login');
  }

  irParaMeuPerfil() {
    this.navController.navigateForward('/meu-perfil');
  }

  sair() {
    this.usuarioService.sair();
    this.navController.navigateRoot('/login');
  }
}