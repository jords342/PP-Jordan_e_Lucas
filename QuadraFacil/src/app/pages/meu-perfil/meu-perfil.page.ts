import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors,
         Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon,
         ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, cameraOutline } from 'ionicons/icons';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

// Validador: só valida se as senhas coincidem quando uma nova senha foi digitada
function senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
  const novaSenha = control.get('novaSenha')?.value;
  const confirmar = control.get('confirmarSenha')?.value;

  if (!novaSenha && !confirmar) return null; // ninguém preencheu, tudo bem
  return novaSenha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.page.html',
  styleUrls: ['./meu-perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon,
            CommonModule, FormsModule, ReactiveFormsModule]
})
export class MeuPerfilPage {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  usuario: UsuarioModel = new UsuarioModel();
  fotoPerfil: string = '';
  formGroup: FormGroup;
  alterandoSenha: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private toastController: ToastController
  ) {
    addIcons({ personOutline, cameraOutline });

    this.formGroup = this.formBuilder.group({
      nomeUsuario: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      novaSenha: [''],
      confirmarSenha: ['']
    }, { validators: senhasIguaisValidator });
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obterSessao();
    this.fotoPerfil = this.usuario.fotoPerfil;
    this.alterandoSenha = false;

    this.formGroup.patchValue({
      nomeUsuario: this.usuario.nomeUsuario,
      novaSenha: '',
      confirmarSenha: ''
    });
  }

  mostrarAlterarSenha() {
    this.alterandoSenha = true;
  }

  cancelarAlterarSenha() {
    this.alterandoSenha = false;
    this.formGroup.patchValue({ novaSenha: '', confirmarSenha: '' });
  }

  selecionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoPerfil = reader.result as string;
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  }

  salvar() {
    if (this.formGroup.hasError('senhasDiferentes')) {
      this.exibirMensagem('As senhas não coincidem.');
      return;
    }

    const novaSenha = this.formGroup.value.novaSenha;

    const usuarioAtualizado = new UsuarioModel();
    usuarioAtualizado.idUsuario = this.usuario.idUsuario;
    usuarioAtualizado.nomeUsuario = this.formGroup.value.nomeUsuario;
    usuarioAtualizado.email = this.usuario.email;
    usuarioAtualizado.senha = novaSenha ? novaSenha : this.usuario.senha;
    usuarioAtualizado.fotoPerfil = this.fotoPerfil;
    usuarioAtualizado.criadoEm = this.usuario.criadoEm;
    usuarioAtualizado.papel = this.usuario.papel;

    this.usuarioService.alterar(usuarioAtualizado).subscribe({
      next: (usuarioSalvo) => {
        this.usuarioService.salvarSessao(usuarioSalvo);
        this.usuario = usuarioSalvo;
        this.alterandoSenha = false;
        this.formGroup.patchValue({ novaSenha: '', confirmarSenha: '' });
        this.exibirMensagem('Perfil atualizado com sucesso!');
      },
      error: () => this.exibirMensagem('Erro ao atualizar perfil.')
    });
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}