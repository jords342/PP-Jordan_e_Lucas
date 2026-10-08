import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { sendOutline, personCircleOutline, calendarOutline } from 'ionicons/icons';

import { ConversaModel } from 'src/app/model/conversa.model';
import { ConversaService } from 'src/app/services/conversa.service';
import { MensagemModel } from 'src/app/model/mensagem.model';
import { MensagemService } from 'src/app/services/mensagem.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SolicitacaoService } from 'src/app/services/solicitacao.service';
import { SolicitacaoModel } from 'src/app/model/solicitacao.model';

@Component({
  selector: 'app-conversa',
  templateUrl: './conversa.page.html',
  styleUrls: ['./conversa.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule]
})
export class ConversaPage {

  @ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;

  conversaId: string = '';
  conversa: ConversaModel = new ConversaModel();
  usuarioAtual: UsuarioModel = new UsuarioModel();
  outroUsuarioId: string = '';
  nomeOutroUsuario: string = '';
  fotoOutroUsuario: string = '';

  mensagens: MensagemModel[] = [];
  textoNovaMensagem: string = '';

  // Cache local de solicitações (id -> solicitacao), pra saber dono/solicitante
  solicitacoesCache: { [id: string]: SolicitacaoModel } = {};

  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private conversaService: ConversaService,
    private mensagemService: MensagemService,
    private usuarioService: UsuarioService,
    private solicitacaoService: SolicitacaoService,
    private toastController: ToastController
  ) {
    addIcons({ sendOutline, personCircleOutline, calendarOutline });
  }

  ionViewWillEnter() {
    this.usuarioAtual = this.usuarioService.obterSessao();
    this.conversaId = this.route.snapshot.paramMap.get('id') || '';

    if (this.conversaId) {
      this.carregarConversa();
      this.carregarMensagens();

      this.intervalId = setInterval(() => this.carregarMensagens(), 4000);
    }
  }

  ionViewWillLeave() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  carregarConversa() {
    this.conversaService.buscarPorId(this.conversaId).subscribe({
      next: (conversa) => {
        this.conversa = conversa;
        this.outroUsuarioId = conversa.usuario1Id === this.usuarioAtual.idUsuario
          ? conversa.usuario2Id
          : conversa.usuario1Id;

        this.usuarioService.buscarPorId(this.outroUsuarioId).subscribe({
          next: (usuario) => {
            this.nomeOutroUsuario = usuario.nomeUsuario;
            this.fotoOutroUsuario = usuario.fotoPerfil;
          }
        });
      }
    });
  }

  carregarMensagens() {
    this.mensagemService.listarPorConversa(this.conversaId).subscribe({
      next: (mensagens) => {
        const chegouMensagemNova = mensagens.length > this.mensagens.length;
        this.mensagens = mensagens;

        // Carrega dados das solicitações novas (pra saber dono/solicitante)
        mensagens
          .filter(m => m.tipoMensagem === 'PEDIDO_ALUGUEL' && m.solicitacaoId && !this.solicitacoesCache[m.solicitacaoId])
          .forEach(m => this.carregarSolicitacao(m.solicitacaoId));

        if (chegouMensagemNova) {
          setTimeout(() => this.rolarParaFinal(), 100);
        }
      }
    });
  }

  private carregarSolicitacao(id: string) {
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (solicitacao) => {
        this.solicitacoesCache[id] = solicitacao;
      }
    });
  }

  enviar() {
    const texto = this.textoNovaMensagem.trim();
    if (!texto) return;

    const mensagem = new MensagemModel();
    mensagem.conversaId = this.conversaId;
    mensagem.remetenteId = this.usuarioAtual.idUsuario;
    mensagem.texto = texto;
    mensagem.tipoMensagem = 'TEXTO';

    this.textoNovaMensagem = '';

    this.mensagemService.enviar(mensagem).subscribe({
      next: () => this.carregarMensagens()
    });
  }

  rolarParaFinal() {
    if (this.scrollArea) {
      this.scrollArea.nativeElement.scrollTop = this.scrollArea.nativeElement.scrollHeight;
    }
  }

  // ===== Helpers do card de pedido =====

  souDono(mensagem: MensagemModel): boolean {
    const sol = this.solicitacoesCache[mensagem.solicitacaoId];
    return !!sol && sol.donoId === this.usuarioAtual.idUsuario;
  }

  souSolicitante(mensagem: MensagemModel): boolean {
    const sol = this.solicitacoesCache[mensagem.solicitacaoId];
    return !!sol && sol.solicitanteId === this.usuarioAtual.idUsuario;
  }

  labelStatus(status: string): string {
    switch (status) {
      case 'ACEITA': return 'Aceito';
      case 'RECUSADA': return 'Recusado';
      case 'CANCELADA': return 'Cancelado';
      default: return 'Pendente';
    }
  }

  // ===== Ações do card =====

  aceitarPedido(mensagem: MensagemModel) {
    this.solicitacaoService.aceitar(mensagem.solicitacaoId, this.usuarioAtual.idUsuario).subscribe({
      next: () => {
        this.exibirMensagem('Pedido aceito!');
        this.carregarMensagens();
      },
      error: (erro) => {
        if (erro.status === 409) {
          this.exibirMensagem('Esse horário já foi reservado.');
        } else {
          this.exibirMensagem('Erro ao aceitar pedido.');
        }
        this.carregarMensagens();
      }
    });
  }

  recusarPedido(mensagem: MensagemModel) {
    this.solicitacaoService.recusar(mensagem.solicitacaoId, this.usuarioAtual.idUsuario).subscribe({
      next: () => {
        this.exibirMensagem('Pedido recusado.');
        this.carregarMensagens();
      },
      error: () => this.exibirMensagem('Erro ao recusar pedido.')
    });
  }

  cancelarPedido(mensagem: MensagemModel) {
    this.solicitacaoService.cancelar(mensagem.solicitacaoId, this.usuarioAtual.idUsuario).subscribe({
      next: () => {
        this.exibirMensagem('Pedido cancelado.');
        this.carregarMensagens();
      },
      error: () => this.exibirMensagem('Erro ao cancelar pedido.')
    });
  }

  voltar() {
    this.navController.navigateBack('/app/conversas');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}