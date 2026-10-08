import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline, personOutline, calendarOutline,
  imagesOutline, documentTextOutline, closeOutline
} from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { FotoQuadraModel } from 'src/app/model/foto-quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';

@Component({
  selector: 'app-quadras-pendentes',
  templateUrl: './quadras-pendentes.page.html',
  styleUrls: ['./quadras-pendentes.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, DatePipe]
})
export class QuadrasPendentesPage {

  quadras: QuadraModel[] = [];

  modalAberto: boolean = false;
  modoDocumento: boolean = false;
  quadraSelecionada: QuadraModel | null = null;
  midia: FotoQuadraModel[] = [];
  carregandoMidia: boolean = false;

  constructor(
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private toastController: ToastController
  ) {
    addIcons({
      locationOutline, personOutline, calendarOutline,
      imagesOutline, documentTextOutline, closeOutline
    });
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

  abrirFotos(quadra: QuadraModel) {
    this.abrirMidia(quadra, false);
  }

  abrirDocumentos(quadra: QuadraModel) {
    this.abrirMidia(quadra, true);
  }

  private abrirMidia(quadra: QuadraModel, modoDocumento: boolean) {
    this.quadraSelecionada = quadra;
    this.modoDocumento = modoDocumento;
    this.midia = [];
    this.carregandoMidia = true;
    this.modalAberto = true;

    const tipo = modoDocumento ? 'DOCUMENTO' : 'FOTO';

    this.fotoQuadraService.listarPorQuadra(quadra.idQuadra, tipo).subscribe({
      next: (itens) => {
        this.midia = itens || [];
        this.carregandoMidia = false;
      },
      error: () => {
        this.midia = [];
        this.carregandoMidia = false;
        this.exibirMensagem('Erro ao carregar mídia.');
      }
    });
  }

  fecharModal() {
    this.modalAberto = false;
    this.quadraSelecionada = null;
    this.midia = [];
    this.modoDocumento = false;
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}