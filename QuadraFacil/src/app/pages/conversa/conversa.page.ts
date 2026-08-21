import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { sendOutline, personCircleOutline } from 'ionicons/icons';

import { ConversaModel } from 'src/app/model/conversa.model';
import { ConversaService } from 'src/app/services/conversa.service';
import { MensagemModel } from 'src/app/model/mensagem.model';
import { MensagemService } from 'src/app/services/mensagem.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private conversaService: ConversaService,
    private mensagemService: MensagemService,
    private usuarioService: UsuarioService
  ) {
    addIcons({ sendOutline, personCircleOutline });
  }

  ionViewWillEnter() {
    this.usuarioAtual = this.usuarioService.obterSessao();
    this.conversaId = this.route.snapshot.paramMap.get('id') || '';

    if (this.conversaId) {
      this.carregarConversa();
      this.carregarMensagens();

      // Verifica mensagens novas a cada 4 segundos
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

        if (chegouMensagemNova) {
          setTimeout(() => this.rolarParaFinal(), 100);
        }
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

  voltar() {
    this.navController.navigateBack('/app/conversas');
  }
}