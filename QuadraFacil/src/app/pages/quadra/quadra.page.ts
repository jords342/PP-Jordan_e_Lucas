import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  imageOutline, star, starOutline, 
  chevronBackOutline, chevronForwardOutline 
} from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraModel } from 'src/app/model/foto-quadra.model';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AvaliacaoModel } from 'src/app/model/avaliacao.model';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ConversaService } from 'src/app/services/conversa.service';
import { ConversaModel } from 'src/app/model/conversa.model';

@Component({
  selector: 'app-quadra',
  templateUrl: './quadra.page.html',
  styleUrls: ['./quadra.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule]
})
export class QuadraPage {

  @ViewChild('carrossel') carrosselElement!: ElementRef<HTMLDivElement>;

  quadra: QuadraModel = new QuadraModel();
  fotos: FotoQuadraModel[] = [];
  nomeProprietario: string = '';
  usuarioAtualId: string = '';

  avaliacoes: AvaliacaoModel[] = [];
  nomesAvaliadores: { [usuarioId: string]: string } = {};
  usuarioJaAvaliou: boolean = false;
  media: number = 0;
  mediaArredondada: number = 0;
  avaliacaoDoUsuario: AvaliacaoModel | null = null;

  // Controle do Carrossel de Fotos
  fotoAtualIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private usuarioService: UsuarioService,
    private avaliacaoService: AvaliacaoService,
    private conversaService: ConversaService,
    private toastController: ToastController 
  ) {
    addIcons({ 
      imageOutline, star, starOutline, 
      chevronBackOutline, chevronForwardOutline 
    });
  }

  ionViewWillEnter() {
    const usuario = this.usuarioService.obterSessao();
    this.usuarioAtualId = usuario ? usuario.idUsuario : '';

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fotoAtualIndex = 0;
      this.carregarQuadra(id);
    }
  }

  carregarQuadra(id: string) {
    this.quadraService.buscarPorId(id).subscribe({
      next: (quadra) => {
        this.quadra = quadra;
        this.carregarProprietario(quadra.proprietarioId);
        this.carregarFotos(id);
        this.carregarAvaliacoes(id);
      }
    });
  }

  carregarFotos(quadraId: string) {
    this.fotoQuadraService.listarPorQuadra(quadraId).subscribe({
      next: (fotos) => {
        this.fotos = fotos;
        this.fotoAtualIndex = 0;
      }
    });
  }

  // MÉTODOS DO CARROSSEL DE FOTOS
  proximaFoto() {
    if (this.fotoAtualIndex < this.fotos.length - 1) {
      this.fotoAtualIndex++;
      this.irParaSlide(this.fotoAtualIndex);
    }
  }

  fotoAnterior() {
    if (this.fotoAtualIndex > 0) {
      this.fotoAtualIndex--;
      this.irParaSlide(this.fotoAtualIndex);
    }
  }

  irParaSlide(index: number) {
    if (this.carrosselElement) {
      const largura = this.carrosselElement.nativeElement.clientWidth;
      this.carrosselElement.nativeElement.scrollTo({
        left: index * largura,
        behavior: 'smooth'
      });
    }
  }

  aoRolarCarrossel() {
    if (this.carrosselElement) {
      const scrollLeft = this.carrosselElement.nativeElement.scrollLeft;
      const largura = this.carrosselElement.nativeElement.clientWidth || 1;
      this.fotoAtualIndex = Math.round(scrollLeft / largura);
    }
  }

  carregarProprietario(proprietarioId: string) {
    this.usuarioService.buscarPorId(proprietarioId).subscribe({
      next: (usuario) => this.nomeProprietario = usuario.nomeUsuario
    });
  }

  carregarAvaliacoes(quadraId: string) {
    const usuario = this.usuarioService.obterSessao();

    this.avaliacaoService.listarPorQuadra(quadraId).subscribe({
      next: (avaliacoes) => {
        this.avaliacoes = avaliacoes;

        this.avaliacaoDoUsuario = avaliacoes.find(a => a.usuarioId === usuario.idUsuario) || null;
        this.usuarioJaAvaliou = this.avaliacaoDoUsuario !== null;

        if (avaliacoes.length > 0) {
          const soma = avaliacoes.reduce((total, a) => total + a.nota, 0);
          this.media = soma / avaliacoes.length;
          this.mediaArredondada = Math.round(this.media);
        } else {
          this.media = 0;
          this.mediaArredondada = 0;
        }

        avaliacoes.forEach(avaliacao => {
          if (!this.nomesAvaliadores[avaliacao.usuarioId]) {
            this.usuarioService.buscarPorId(avaliacao.usuarioId).subscribe({
              next: (usuario) => this.nomesAvaliadores[avaliacao.usuarioId] = usuario.nomeUsuario
            });
          }
        });
      }
    });
  }

  // MÉTODO CORRIGIDO: usa o iniciar(usuario1Id, usuario2Id)
  enviarMensagem() {
    const usuario = this.usuarioService.obterSessao();
    if (!usuario || !usuario.idUsuario) {
      this.exibirMensagem('Faça login para enviar mensagens.');
      return;
    }

    this.conversaService.iniciar(usuario.idUsuario, this.quadra.proprietarioId).subscribe({
      next: (conversaCriada: ConversaModel) => {
        this.navController.navigateForward(`/app/conversa/${conversaCriada.idConversa}`);
      },
      error: () => this.exibirMensagem('Erro ao abrir conversa.')
    });
  }

  excluirAvaliacao() {
    if (!this.avaliacaoDoUsuario) return;

    this.avaliacaoService.excluir(this.avaliacaoDoUsuario.idAvaliacao).subscribe({
      next: () => {
        this.exibirMensagem('Avaliação excluída com sucesso.');
        this.carregarAvaliacoes(this.quadra.idQuadra);
      },
      error: () => this.exibirMensagem('Erro ao excluir avaliação.')
    });
  }

  enviarMensagem() {
    this.conversaService.iniciar(this.usuarioAtualId, this.quadra.proprietarioId).subscribe({
      next: (conversa) => this.navController.navigateForward(`/app/conversa/${conversa.idConversa}`),
      error: () => this.exibirMensagem('Erro ao iniciar conversa.')
    });
  }

  abrirFotos() {
    this.modalAberto = true;
  }

  fecharFotos() {
    this.modalAberto = false;
  }

  excluirQuadra() {
    this.quadraService.excluir(this.quadra.idQuadra).subscribe({
      next: () => {
        this.exibirMensagem('Quadra excluída com sucesso.');
        this.navController.navigateBack('/app/main');
      },
      error: () => this.exibirMensagem('Erro ao excluir quadra.')
    });
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }

  irParaComentar() {
    this.navController.navigateForward(`/app/comentar/${this.quadra.idQuadra}`);
  }
}