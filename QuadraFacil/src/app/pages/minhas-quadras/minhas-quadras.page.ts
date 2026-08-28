import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonButton, IonIcon, 
  IonRefresher, IonRefresherContent, 
  ToastController 
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-minhas-quadras',
  templateUrl: './minhas-quadras.page.html',
  styleUrls: ['./minhas-quadras.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonButton, IonIcon, 
    IonRefresher, IonRefresherContent, 
    CommonModule
  ]
})
export class MinhasQuadrasPage {

  quadras: QuadraModel[] = [];
  fotos: { [quadraId: string]: string } = {};

  constructor(
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private usuarioService: UsuarioService,
    private navController: NavController,
    private toastController: ToastController
  ) {
    addIcons({ imageOutline });
  }

  ionViewWillEnter() {
    this.carregarQuadras();
  }

  carregarQuadras(event?: any) {
    const usuario = this.usuarioService.obterSessao();
    
    if (!usuario || !usuario.idUsuario) {
      if (event) event.target.complete();
      return;
    }

    this.quadraService.listarPorProprietario(usuario.idUsuario).subscribe({
      next: (quadras) => {
        this.quadras = quadras;
        quadras.forEach(quadra => {
          this.fotoQuadraService.listarPorQuadra(quadra.idQuadra).subscribe({
            next: (fotos) => {
              if (fotos && fotos.length > 0) {
                this.fotos[quadra.idQuadra] = fotos[0].imagemBase64;
              }
            },
            error: (err) => {
              console.warn(`Aviso: Não foi possível carregar a foto da quadra "${quadra.nome}" (${quadra.idQuadra}).`, err);
              this.fotos[quadra.idQuadra] = ''; 
            }
          });
        });

        if (event) {
          event.target.complete(); // Encerra a animação do refresher
        }
      },
      error: (err) => {
        console.error('Erro ao listar quadras do proprietário:', err);
        this.exibirMensagem('Erro ao carregar a lista de quadras.');
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  recarregar(event: any) {
    this.carregarQuadras(event);
  }

  irParaCriarQuadra() {
    this.navController.navigateForward('/app/criar-quadra');
  }

  irParaQuadra(id: string) {
    this.navController.navigateForward(`/app/quadra/${id}`);
  }

  excluir(quadra: QuadraModel) {
    this.quadraService.excluir(quadra.idQuadra).subscribe({
      next: () => {
        this.exibirMensagem(`"${quadra.nome}" excluída com sucesso.`);
        this.carregarQuadras();
      },
      error: () => this.exibirMensagem('Erro ao excluir quadra.')
    });
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}