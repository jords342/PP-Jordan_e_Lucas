import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonItem,
         IonInput, IonLabel, ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonInput, IonButton, IonContent,
            IonHeader, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private usuarioService: UsuarioService
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
    this.usuarioService.limparSessao();
  }

  entrar() {
    const { email, senha } = this.formGroup.value;

    this.usuarioService.autenticar(email, senha).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuarioService.salvarSessao(usuario);
          this.navController.navigateRoot('/main');
        } else {
          this.exibirMensagem('Email ou senha incorretos.');
        }
      }
    });
  }

  irParaCadastro() {
    this.navController.navigateForward('/cadastro');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}