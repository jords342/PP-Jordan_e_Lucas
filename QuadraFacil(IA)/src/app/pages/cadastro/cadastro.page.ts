import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, ToastController, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mapOutline } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';

function senhasIguais(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha')?.value;
  const repetir = control.get('repetirSenha')?.value;
  return senha === repetir ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CadastroPage {

  formGroup: FormGroup;
  mostrarSenha = false;
  mostrarRepetir = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private navController: NavController,
    private toastController: ToastController
  ) {
    addIcons({ eyeOutline, eyeOffOutline, mapOutline });

    this.formGroup = this.fb.group({
      nomeUsuario: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      repetirSenha: ['', Validators.required]
    }, { validators: senhasIguais });
  }

  cadastrar() {
    if (this.formGroup.hasError('senhasDiferentes')) {
      this.exibirMensagem('As senhas não coincidem.');
      return;
    }
    const { nomeUsuario, senha } = this.formGroup.value;
    const sucesso = this.usuarioService.cadastrar(nomeUsuario, nomeUsuario, senha);
    if (sucesso) {
      this.exibirMensagem('Conta criada com sucesso!');
      this.navController.navigateBack('/login');
    } else {
      this.exibirMensagem('Usuário já existe.');
    }
  }

  irParaLogin() {
    this.navController.navigateBack('/login');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}