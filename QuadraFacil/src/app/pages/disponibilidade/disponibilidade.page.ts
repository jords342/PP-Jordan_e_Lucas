import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonDatetime, ActionSheetController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

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
  imports: [IonContent, IonDatetime, CommonModule]
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

  // Controla se a seção de horários expandiu
  mostrarHorarios: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private quadraService: QuadraService,
    private disponibilidadeService: DisponibilidadeService,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController
  ) {
    const hoje = new Date();
    this.dataMinima = hoje.toISOString().split('T')[0];
    this.dataSelecionada = this.dataMinima;
    this.formatarDataPT(this.dataSelecionada);
  }

  ionViewWillEnter() {
    this.usuarioAtualId = this.usuarioService.obterSessao().idUsuario;
    this.quadraId = this.route.snapshot.paramMap.get('quadraId') || '';

    if (this.quadraId) {
      this.quadraService.buscarPorId(this.quadraId).subscribe({
        next: (quadra) => {
          this.quadra = quadra;
          this.ehProprietario = quadra.proprietarioId === this.usuarioAtualId;
        }
      });

      // Inicialmente não expande até que o usuário clique no dia
      this.mostrarHorarios = false;
    }
  }

  onDataSelected(event: any) {
    this.onDataSelecionada(event);
  }

  onDataSelecionada(event: any) {
    const dataCompleta = event.detail.value as string; // ex: "2026-09-10T00:00:00"
    this.dataSelecionada = dataCompleta.split('T')[0];
    this.formatarDataPT(this.dataSelecionada);
    
    // Expande a seção de horários com animação
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
            status: mapa[hora]?.status || 'LIVRE'
          });
        }
      }
    });
  }

  async onClicarHorario(item: HorarioExibicao) {
    if (!this.ehProprietario) {
      return;
    }

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