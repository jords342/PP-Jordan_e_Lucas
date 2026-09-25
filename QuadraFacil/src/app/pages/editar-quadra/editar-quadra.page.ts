import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton, IonSelect,
  IonSelectOption, ToastController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';

@Component({
  selector: 'app-editar-quadra',
  templateUrl: './editar-quadra.page.html',
  styleUrls: ['./editar-quadra.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonInput, IonButton, IonSelect,
    IonSelectOption, CommonModule, ReactiveFormsModule
  ]
})
export class EditarQuadraPage {

  quadra: QuadraModel = new QuadraModel();
  formGroup: FormGroup;

  horasDisponiveis: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private route: ActivatedRoute,
    private quadraService: QuadraService
  ) {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      endereco: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      horaAbertura: [8, Validators.required],
      horaFechamento: [22, Validators.required]
    });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.quadraService.buscarPorId(id).subscribe({
        next: (quadra) => {
          this.quadra = quadra;
          this.formGroup.patchValue({
            nome: quadra.nome,
            endereco: quadra.endereco,
            horaAbertura: quadra.horaAbertura ?? 8,
            horaFechamento: quadra.horaFechamento ?? 22
          });
        }
      });
    }
  }

  salvar() {
    if (!this.formGroup.valid) return;

    this.quadra.nome = this.formGroup.value.nome;
    this.quadra.endereco = this.formGroup.value.endereco;
    this.quadra.horaAbertura = this.formGroup.value.horaAbertura;
    this.quadra.horaFechamento = this.formGroup.value.horaFechamento;

    this.quadraService.alterar(this.quadra).subscribe({
      next: () => {
        this.exibirMensagem('Quadra atualizada com sucesso!');
        this.navController.navigateBack(`/app/quadra/${this.quadra.idQuadra}`);
      },
      error: () => this.exibirMensagem('Erro ao atualizar quadra.')
    });
  }

  voltar() {
    this.navController.navigateBack(`/app/quadra/${this.quadra.idQuadra}`);
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}