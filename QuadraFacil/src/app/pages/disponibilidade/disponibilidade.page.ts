import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonDatetime, IonIcon, ActionSheetController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { DisponibilidadeModel } from 'src/app/model/disponibilidade.model';
import { DisponibilidadeService } from 'src/app/services/disponibilidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  imports: [IonContent, IonDatetime, IonIcon, CommonModule]
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

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private quadraService: QuadraService,
    private disponibilidadeService: DisponibilidadeService,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController
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

    // Encadeado: primeiro a quadra, depois os horários.
    // Isso evita a race condition onde carregarHorarios rodava
    // antes de this.quadra estar preenchida.
    this.quadraService.buscarPorId(this.quadraId).subscribe({
      next: (quadra) => {
        this.quadra = quadra;
        this.ehProprietario = quadra.proprietarioId === this.usuarioAtualId;

        // Já mostra os horários do dia de hoje ao abrir a tela
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

  /**
   * Regra de derivação:
   *  1. Se existe registro explícito no banco, ele manda (exceção manual ou aluguel).
   *  2. Senão, deriva do expediente da quadra:
   *     - dentro do expediente → LIVRE
   *     - fora do expediente  → FECHADO
   */
  private calcularStatusHora(
    hora: number,
    mapa: { [hora: number]: DisponibilidadeModel }
  ): 'LIVRE' | 'ALUGADO' | 'FECHADO' {

    const registro = mapa[hora];
    if (registro) return registro.status;

    return this.horaDentroDoExpediente(hora) ? 'LIVRE' : 'FECHADO';
  }

  /**
   * Suporta expediente que cruza meia-noite (ex: abre 20h, fecha 4h).
   */
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
    if (!this.ehProprietario) return;

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
  }

  definirStatus(hora: number, status: string) {
    this.disponibilidadeService.definirStatus(
      this.quadraId, this.dataSelecionada, hora, status, this.usuarioAtualId
    ).subscribe({
      next: () => this.carregarHorarios(this.dataSelecionada)
    });
  }

  voltar() {
    this.navController.navigateBack(`/app/quadra/${this.quadraId}`);
  }
}