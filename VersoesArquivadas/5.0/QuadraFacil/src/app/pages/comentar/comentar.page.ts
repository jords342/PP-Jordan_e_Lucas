import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  IonContent, IonTextarea, IonButton, IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

import { AvaliacaoModel } from 'src/app/model/avaliacao.model';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-comentar',
  templateUrl: './comentar.page.html',
  styleUrls: ['./comentar.page.scss'],
  standalone: true,
  imports: [IonContent, IonTextarea, IonButton, IonIcon,
    CommonModule, FormsModule, ReactiveFormsModule]
})
export class ComentarPage {

  formGroup: FormGroup;
  nota: number = 0;
  quadraId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private route: ActivatedRoute,
    private avaliacaoService: AvaliacaoService,
    private usuarioService: UsuarioService
  ) {
    addIcons({ star, starOutline });

    this.formGroup = this.formBuilder.group({
      comentario: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });
  }

  ionViewWillEnter() {
    this.quadraId = this.route.snapshot.paramMap.get('quadraId') || '';
  }

  selecionarNota(valor: number) {
    this.nota = valor;
  }

  enviar() {
    const usuario = this.usuarioService.obterSessao();

    const avaliacao = new AvaliacaoModel();
    avaliacao.quadraId = this.quadraId;
    avaliacao.usuarioId = usuario.idUsuario;
    avaliacao.comentario = this.formGroup.value.comentario;
    avaliacao.nota = this.nota;

    this.avaliacaoService.criar(avaliacao).subscribe({
      next: () => {
        this.exibirMensagem('Avaliação enviada com sucesso!');
        this.navController.navigateBack(`/app/quadra/${this.quadraId}`);
      },
      error: (erro) => {
        if (erro.status === 409) {
          this.exibirMensagem('Você já avaliou esta quadra.');
          this.navController.navigateBack(`/app/quadra/${this.quadraId}`);
        } else {
          this.exibirMensagem('Erro ao enviar avaliação.');
        }
      }
    });
  }

  voltar() {
    this.navController.navigateBack(`/app/quadra/${this.quadraId}`);
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}