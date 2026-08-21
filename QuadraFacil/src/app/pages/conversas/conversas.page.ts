import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { ConversaModel } from 'src/app/model/conversa.model';
import { ConversaService } from 'src/app/services/conversa.service';
import { MensagemService } from 'src/app/services/mensagem.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

interface ConversaExibicao {
  conversa: ConversaModel;
  outroUsuarioId: string;
  nomeOutroUsuario: string;
  fotoOutroUsuario: string;
  ultimaMensagem: string;
  ultimaMensagemEm: string;
}

@Component({
  selector: 'app-conversas',
  templateUrl: './conversas.page.html',
  styleUrls: ['./conversas.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule]
})
export class ConversasPage {

  usuarioAtual: UsuarioModel = new UsuarioModel();
  conversas: ConversaExibicao[] = [];
  carregando: boolean = true;

  constructor(
    private conversaService: ConversaService,
    private mensagemService: MensagemService,
    private usuarioService: UsuarioService,
    private navController: NavController
  ) {
    addIcons({ personCircleOutline });
  }

  ionViewWillEnter() {
    this.usuarioAtual = this.usuarioService.obterSessao();
    this.carregarConversas();
  }

  carregarConversas() {
    this.carregando = true;

    this.conversaService.listarPorUsuario(this.usuarioAtual.idUsuario).subscribe({
      next: (conversas) => {
        this.conversas = [];
        this.carregando = false;

        conversas.forEach(conversa => {
          const outroUsuarioId = conversa.usuario1Id === this.usuarioAtual.idUsuario
            ? conversa.usuario2Id
            : conversa.usuario1Id;

          const item: ConversaExibicao = {
            conversa,
            outroUsuarioId,
            nomeOutroUsuario: '',
            fotoOutroUsuario: '',
            ultimaMensagem: '',
            ultimaMensagemEm: conversa.criadoEm
          };

          this.conversas.push(item);

          this.usuarioService.buscarPorId(outroUsuarioId).subscribe({
            next: (usuario) => {
              item.nomeOutroUsuario = usuario.nomeUsuario;
              item.fotoOutroUsuario = usuario.fotoPerfil;
            }
          });

          this.mensagemService.listarPorConversa(conversa.idConversa).subscribe({
            next: (mensagens) => {
              if (mensagens.length > 0) {
                const ultima = mensagens[mensagens.length - 1];
                item.ultimaMensagem = ultima.texto;
                item.ultimaMensagemEm = ultima.criadoEm;
              } else {
                item.ultimaMensagem = 'Nenhuma mensagem ainda';
              }
              this.ordenarConversas();
            }
          });
        });
      },
      error: () => this.carregando = false
    });
  }

  ordenarConversas() {
    this.conversas.sort((a, b) =>
      new Date(b.ultimaMensagemEm).getTime() - new Date(a.ultimaMensagemEm).getTime()
    );
  }

  irParaConversa(idConversa: string) {
    this.navController.navigateForward(`/app/conversa/${idConversa}`);
  }
}