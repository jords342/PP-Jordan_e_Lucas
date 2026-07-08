import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraModel } from 'src/app/model/foto-quadra.model';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-quadra',
  templateUrl: './quadra.page.html',
  styleUrls: ['./quadra.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule]
})
export class QuadraPage {

  quadra: QuadraModel = new QuadraModel();
  fotos: FotoQuadraModel[] = [];
  nomeProprietario: string = '';

  constructor(
    private route: ActivatedRoute,
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private usuarioService: UsuarioService
  ) {
    addIcons({ imageOutline });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.carregarQuadra(id);
  }

  carregarQuadra(id: string) {
    this.quadraService.buscarPorId(id).subscribe({
      next: (quadra) => {
        this.quadra = quadra;
        this.carregarProprietario(quadra.proprietarioId);
        this.carregarFotos(id);
      }
    });
  }

  carregarFotos(quadraId: string) {
    this.fotoQuadraService.listarPorQuadra(quadraId).subscribe({
      next: (fotos) => this.fotos = fotos
    });
  }

  modalAberto: boolean = false;

  abrirFotos() {
    this.modalAberto = true;
  }

  fecharFotos() {
    this.modalAberto = false;
  }
  carregarProprietario(proprietarioId: string) {
    this.usuarioService.buscarPorId(proprietarioId).subscribe({
      next: (usuario) => this.nomeProprietario = usuario.nomeUsuario
    });
  }
}