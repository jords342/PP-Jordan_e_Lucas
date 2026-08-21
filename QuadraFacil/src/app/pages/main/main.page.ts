import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonIcon, 
  IonRefresher, IonRefresherContent 
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonIcon, 
    IonRefresher, IonRefresherContent, 
    CommonModule
  ]
})
export class MainPage {

  quadras: QuadraModel[] = [];
  fotos: { [quadraId: string]: string } = {};

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

  carregarQuadras(event?: any) {
    this.quadraService.listarAtivas().subscribe({
      next: (quadras) => {
        this.quadras = quadras;
        quadras.forEach(quadra => {
          this.fotoQuadraService.listarPorQuadra(quadra.idQuadra).subscribe({
            next: (fotos) => {
              if (fotos.length > 0) {
                this.fotos[quadra.idQuadra] = fotos[0].imagemBase64;
              }
            }
          });
        });

        if (event) {
          event.target.complete(); // Encerra a animação do refresher
        }
      },
      error: () => {
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  recarregar(event: any) {
    this.carregarQuadras(event);
  }

  irParaQuadra(id: string) {
    this.navController.navigateForward(`/app/quadra/${id}`);
  }
}