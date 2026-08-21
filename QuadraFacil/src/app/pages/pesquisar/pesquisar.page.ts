import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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

  termoPesquisa: string = '';
  resultados: QuadraModel[] = [];
  fotos: { [quadraId: string]: string } = {};
  carregando: boolean = false;

  private pesquisa$ = new Subject<string>();

  constructor(
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private navController: NavController
  ) {
    addIcons({ imageOutline });

    // Pesquisa em tempo real com debounce de 400ms
    this.pesquisa$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(texto => this.pesquisar(texto));
  }

  onDigitar() {
    this.pesquisa$.next(this.termoPesquisa.trim());
  }

  pesquisar(texto: string) {
    if (texto.length === 0) {
      this.resultados = [];
      return;
    }

    this.carregando = true;

    this.quadraService.pesquisar(texto).subscribe({
      next: (quadras) => {
        this.resultados = quadras;
        this.carregando = false;

        quadras.forEach(quadra => {
          if (!this.fotos[quadra.idQuadra]) {
            this.fotoQuadraService.listarPorQuadra(quadra.idQuadra).subscribe({
              next: (fotos) => {
                if (fotos.length > 0) {
                  this.fotos[quadra.idQuadra] = fotos[0].imagemBase64;
                }
              }
            });
          }
        });
      },
      error: () => this.carregando = false
    });
  }

  irParaQuadra(id: string) {
    this.navController.navigateForward(`/app/quadra/${id}`);
  }
}