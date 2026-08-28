import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.page.html',
  styleUrls: ['./pesquisar.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonIcon, CommonModule, FormsModule]
})
export class PesquisarPage {

  todasQuadras: QuadraModel[] = [];
  quadrasFiltradas: QuadraModel[] = [];
  fotos: { [quadraId: string]: string } = {};
  termoBusca: string = '';

  constructor(
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private navController: NavController
  ) {
    addIcons({ imageOutline });
  }

  ionViewWillEnter() {
    this.carregarQuadras();
  }

  carregarQuadras() {
    this.quadraService.listarAtivas().subscribe({
      next: (quadras) => {
        this.todasQuadras = quadras;
        this.filtrarQuadras();
        quadras.forEach(quadra => {
          this.fotoQuadraService.listarPorQuadra(quadra.idQuadra).subscribe({
            next: (fotos) => {
              if (fotos && fotos.length > 0) {
                this.fotos[quadra.idQuadra] = fotos[0].imagemBase64;
              }
            }
          });
        });
      }
    });
  }

  filtrarQuadras() {
    if (!this.termoBusca || this.termoBusca.trim() === '') {
      this.quadrasFiltradas = this.todasQuadras;
    } else {
      const termo = this.termoBusca.toLowerCase().trim();
      this.quadrasFiltradas = this.todasQuadras.filter(q => 
        (q.nome && q.nome.toLowerCase().includes(termo)) || 
        (q.endereco && q.endereco.toLowerCase().includes(termo))
      );
    }
  }

  irParaQuadra(id: string) {
    this.navController.navigateForward(`/app/quadra/${id}`);
  }
}