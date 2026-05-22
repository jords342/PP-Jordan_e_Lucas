import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, ToastController, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mapOutline } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage {

  formGroup: FormGroup;
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private navController: NavController,
    private toastController: ToastController
  ) {
    addIcons({ eyeOutline, eyeOffOutline, mapOutline });

    this.formGroup = this.fb.group({
      emailOuNome: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  entrar() {
    const { emailOuNome, senha } = this.formGroup.value;
    const usuario = this.usuarioService.login(emailOuNome, senha);
    if (usuario) {
      this.navController.navigateRoot('/conta');
    } else {
      this.exibirMensagem('Usuário ou senha incorretos.');
    }
  }

  irParaCadastro() {
    this.navController.navigateForward('/cadastro');
  }

  esqueceuSenha() {
    this.exibirMensagem('Funcionalidade em breve.');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}