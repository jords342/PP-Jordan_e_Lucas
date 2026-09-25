import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, personOutline, calendarOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';

@Component({
  selector: 'app-quadras-pendentes',
  templateUrl: './quadras-pendentes.page.html',
  styleUrls: ['./quadras-pendentes.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, DatePipe]
})
export class QuadrasPendentesPage {

  quadras: QuadraModel[] = [];

  constructor(
    private quadraService: QuadraService,
    private toastController: ToastController
  ) {
    addIcons({ locationOutline, personOutline, calendarOutline });
  }

  ionViewWillEnter() {
    this.carregarPendentes();
  }

  carregarPendentes() {
    this.quadraService.listarPendentes().subscribe({
      next: (quadras) => this.quadras = quadras
    });
  }

  aceitar(quadra: QuadraModel) {
    this.quadraService.aprovar(quadra.idQuadra).subscribe({
      next: () => {
        this.exibirMensagem(`"${quadra.nome}" aprovada!`);
        this.carregarPendentes();
      },
      error: () => this.exibirMensagem('Erro ao aprovar quadra.')
    });
  }

  recusar(quadra: QuadraModel) {
    this.quadraService.excluir(quadra.idQuadra).subscribe({
      next: () => {
        this.exibirMensagem(`"${quadra.nome}" recusada e removida.`);
        this.carregarPendentes();
      },
      error: () => this.exibirMensagem('Erro ao recusar quadra.')
    });
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}