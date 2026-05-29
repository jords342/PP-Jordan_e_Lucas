import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors,
         Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonItem,
         IonInput, IonLabel, ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

// Validador customizado: as duas senhas precisam ser iguais
function senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha')?.value;
  const confirmar = control.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonInput, IonButton, IonContent,
            IonHeader, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CadastroPage {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private usuarioService: UsuarioService
  ) {
    this.formGroup = this.formBuilder.group({
      nomeUsuario: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email:       ['', Validators.compose([Validators.required, Validators.email])],
      senha:       ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmarSenha: ['', Validators.required]
    }, { validators: senhasIguaisValidator });
  }

  cadastrar() {
    if (this.formGroup.hasError('senhasDiferentes')) {
      this.exibirMensagem('As senhas não coincidem.');
      return;
    }

    const usuario = new UsuarioModel();
    usuario.nomeUsuario = this.formGroup.value.nomeUsuario;
    usuario.email       = this.formGroup.value.email;
    usuario.senha       = this.formGroup.value.senha;

    this.usuarioService.cadastrar(usuario).subscribe({
      next: (novo) => {
        this.usuarioService.salvarSessao(novo);
        this.navController.navigateRoot('/main');
      }
    });
  }

  irParaLogin() {
    this.navController.navigateBack('/login');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}