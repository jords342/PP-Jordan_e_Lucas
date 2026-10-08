import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonDatetime, IonIcon, ActionSheetController, ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { DisponibilidadeModel } from 'src/app/model/disponibilidade.model';
import { DisponibilidadeService } from 'src/app/services/disponibilidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SolicitacaoService } from 'src/app/services/solicitacao.service';

interface HorarioExibicao {
  hora: number;
  horaFormatada: string;
  status: 'LIVRE' | 'ALUGADO' | 'FECHADO';
}

@Component({
  selector: 'app-disponibilidade',
  templateUrl: './disponibilidade.page.html',
  styleUrls: ['./disponibilidade.page.scss'],
  standalone: true,
  imports: [IonContent, IonDatetime, IonIcon, CommonModule, FormsModule]
})
export class DisponibilidadePage {

  quadraId: string = '';
  quadra: QuadraModel = new QuadraModel();
  usuarioAtualId: string = '';
  ehProprietario: boolean = false;

  dataMinima: string = '';
  dataSelecionada: string = '';
  dataFormatadaPT: string = '';
  horarios: HorarioExibicao[] = [];
  mostrarHorarios: boolean = false;

  // Modal de solicitação
  modalSolicitacaoAberto: boolean = false;
  horaSelecionada: number = 0;
  horaSelecionadaFormatada: string = '';
  mensagemSolicitacao: string = '';
  enviandoSolicitacao: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private quadraService: QuadraService,
    private disponibilidadeService: DisponibilidadeService,
    private usuarioService: UsuarioService,
    private solicitacaoService: SolicitacaoService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {
    addIcons({ calendarOutline });

    const hoje = new Date();
    this.dataMinima = hoje.toISOString().split('T')[0];
    this.dataSelecionada = this.dataMinima;
    this.formatarDataPT(this.dataSelecionada);
  }

  ionViewWillEnter() {
    this.usuarioAtualId = this.usuarioService.obterSessao().idUsuario;
    this.quadraId = this.route.snapshot.paramMap.get('quadraId') || '';

    if (!this.quadraId) return;

    this.quadraService.buscarPorId(this.quadraId).subscribe({
      next: (quadra) => {
        this.quadra = quadra;
        this.ehProprietario = quadra.proprietarioId === this.usuarioAtualId;
        this.mostrarHorarios = true;
        this.carregarHorarios(this.dataSelecionada);
      }
    });
  }

  onDataSelecionada(event: any) {
    const dataCompleta = event.detail.value as string;
    this.dataSelecionada = dataCompleta.split('T')[0];
    this.formatarDataPT(this.dataSelecionada);
    this.mostrarHorarios = true;
    this.carregarHorarios(this.dataSelecionada);
  }

  formatarDataPT(dataISO: string) {
    if (!dataISO) return;
    const partes = dataISO.split('-');
    if (partes.length === 3) {
      this.dataFormatadaPT = `${partes[2]}/${partes[1]}/${partes[0]}`;
    } else {
      this.dataFormatadaPT = dataISO;
    }
  }

  carregarHorarios(data: string) {
    this.disponibilidadeService.listarPorQuadraEData(this.quadraId, data).subscribe({
      next: (registros) => {
        const mapa: { [hora: number]: DisponibilidadeModel } = {};
        registros.forEach(r => mapa[r.hora] = r);

        this.horarios = [];
        for (let hora = 0; hora <= 23; hora++) {
          this.horarios.push({
            hora,
            horaFormatada: hora.toString().padStart(2, '0') + ':00',
            status: this.calcularStatusHora(hora, mapa)
          });
        }
      }
    });
  }

  private calcularStatusHora(
    hora: number,
    mapa: { [hora: number]: DisponibilidadeModel }
  ): 'LIVRE' | 'ALUGADO' | 'FECHADO' {

    const registro = mapa[hora];
    if (registro) return registro.status;

    return this.horaDentroDoExpediente(hora) ? 'LIVRE' : 'FECHADO';
  }

  private horaDentroDoExpediente(hora: number): boolean {
    const abertura = this.quadra.horaAbertura ?? 0;
    const fechamento = this.quadra.horaFechamento ?? 23;

    if (abertura <= fechamento) {
      return hora >= abertura && hora < fechamento;
    } else {
      return hora >= abertura || hora < fechamento;
    }
  }

  async onClicarHorario(item: HorarioExibicao) {
    // Dono: abre action sheet pra alterar status manualmente
    if (this.ehProprietario) {
      const actionSheet = await this.actionSheetController.create({
        header: `Alterar Status - Horário ${item.horaFormatada}`,
        buttons: [
          { text: 'Livre (Disponível)', handler: () => this.definirStatus(item.hora, 'LIVRE') },
          { text: 'Alugado (Ocupado)', handler: () => this.definirStatus(item.hora, 'ALUGADO') },
          { text: 'Fechado (Indisponível)', handler: () => this.definirStatus(item.hora, 'FECHADO') },
          { text: 'Cancelar', role: 'cancel' }
        ]
      });
      await actionSheet.present();
      return;
    }

    // Cliente: só pode solicitar se o horário estiver LIVRE
    if (item.status !== 'LIVRE') {
      this.exibirMensagem('Esse horário não está disponível.');
      return;
    }

    // Abre modal de solicitação
    this.horaSelecionada = item.hora;
    this.horaSelecionadaFormatada = item.horaFormatada;
    this.mensagemSolicitacao = '';
    this.modalSolicitacaoAberto = true;
  }

  definirStatus(hora: number, status: string) {
    this.disponibilidadeService.definirStatus(
      this.quadraId, this.dataSelecionada, hora, status, this.usuarioAtualId
    ).subscribe({
      next: () => this.carregarHorarios(this.dataSelecionada)
    });
  }

  // ===== Modal de solicitação =====

  fecharModalSolicitacao() {
    this.modalSolicitacaoAberto = false;
    this.mensagemSolicitacao = '';
    this.enviandoSolicitacao = false;
  }

  confirmarSolicitacao() {
    if (this.enviandoSolicitacao) return;

    this.enviandoSolicitacao = true;

    this.solicitacaoService.criar(
      this.quadraId,
      this.usuarioAtualId,
      this.dataSelecionada,
      this.horaSelecionada,
      this.mensagemSolicitacao.trim()
    ).subscribe({
      next: (solicitacao) => {
        this.enviandoSolicitacao = false;
        this.fecharModalSolicitacao();
        this.exibirMensagem('Pedido enviado! Aguarde a resposta do dono.');

        // Abre a conversa entre o usuário e o dono
        // (reaproveita o fluxo: navega pra conversas; o item com o dono vai estar lá)
        this.navController.navigateForward('/app/conversas');
      },
      error: (erro) => {
        this.enviandoSolicitacao = false;
        if (erro.status === 409) {
          this.exibirMensagem('Esse horário já foi reservado.');
          this.carregarHorarios(this.dataSelecionada);
        } else {
          this.exibirMensagem('Erro ao solicitar aluguel.');
        }
      }
    });
  }

  voltar() {
    this.navController.navigateBack(`/app/quadra/${this.quadraId}`);
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2500 });
    toast.present();
  }
}