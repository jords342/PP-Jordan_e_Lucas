import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, personCircleOutline } from 'ionicons/icons';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.page.html',
  styleUrls: ['./meu-perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, CommonModule, FormsModule, ReactiveFormsModule]
})
export class MeuPerfilPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  formGroup: FormGroup;
  usuarioAtual: UsuarioModel = new UsuarioModel();
  fotoPerfilPreview: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private navController: NavController,
    private toastController: ToastController
  ) {
    addIcons({ cameraOutline, personCircleOutline });

    this.formGroup = this.formBuilder.group({
      nomeUsuario: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  ionViewWillEnter() {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario() {
    this.usuarioAtual = this.usuarioService.obterSessao();
    if (this.usuarioAtual && this.usuarioAtual.idUsuario) {
      this.formGroup.patchValue({
        nomeUsuario: this.usuarioAtual.nomeUsuario,
        email: this.usuarioAtual.email
      });
      this.fotoPerfilPreview = this.usuarioAtual.fotoPerfil || '';
    }
  }

  selecionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfilPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  salvar() {
    if (!this.formGroup.valid) return;

    this.usuarioAtual.nomeUsuario = this.formGroup.value.nomeUsuario;
    this.usuarioAtual.email = this.formGroup.value.email;
    if (this.fotoPerfilPreview) {
      this.usuarioAtual.fotoPerfil = this.fotoPerfilPreview;
    }

    this.usuarioService.alterar(this.usuarioAtual).subscribe({
      next: (usuarioAtualizado) => {
        this.usuarioService.salvarSessao(usuarioAtualizado);
        this.exibirMensagem('Perfil atualizado com sucesso!');
        this.navController.navigateBack('/app/conta');
      },
      error: () => {
        this.exibirMensagem('Erro ao atualizar perfil.');
      }
    });
  }

  irParaEsqueceuSenha() {
    this.navController.navigateForward('/esqueceu-senha');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}