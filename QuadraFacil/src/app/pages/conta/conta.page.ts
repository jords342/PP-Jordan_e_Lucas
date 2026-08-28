import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonItem, IonLabel, IonIcon,
  IonButton, IonToggle
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, eyeOutline, basketballOutline, peopleOutline, moonOutline } from 'ionicons/icons';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonIcon, IonContent, IonToggle, CommonModule]
})
export class ContaPage implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  ehModerador: boolean = false;
  modoEscuro: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private themeService: ThemeService,
    private navController: NavController
  ) {
    addIcons({ personOutline, eyeOutline, basketballOutline, peopleOutline, moonOutline });
  }

  ngOnInit() {
    this.modoEscuro = this.themeService.isModoEscuro();
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obterSessao();
    this.ehModerador = this.usuario.papel === 'MODERADOR';
    this.modoEscuro = this.themeService.isModoEscuro();
  }

  mudarTema(event: any) {
    this.modoEscuro = event.detail.checked;
    this.themeService.alternarTema(this.modoEscuro);
  }

  irPara(rota: string) {
    this.navController.navigateForward(rota);
  }

  sair() {
    this.usuarioService.limparSessao();
    this.navController.navigateRoot('/login');
  }
}