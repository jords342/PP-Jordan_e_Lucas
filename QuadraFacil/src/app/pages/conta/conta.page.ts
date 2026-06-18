import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonItem, IonLabel, IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, warningOutline, basketballOutline, peopleOutline } from 'ionicons/icons';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonIcon, IonContent, CommonModule]
})
export class ContaPage {

  usuario: UsuarioModel = new UsuarioModel();
  ehModerador: boolean = false;
  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController
  ) {
    addIcons({ personOutline, warningOutline, basketballOutline, peopleOutline });
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obterSessao();
    this.ehModerador = this.usuario.papel === 'MODERADOR';
  }

  irPara(rota: string) {
    this.navController.navigateForward(rota);
  }

  sair() {
    this.usuarioService.limparSessao();
    this.navController.navigateRoot('/login');
  }

}