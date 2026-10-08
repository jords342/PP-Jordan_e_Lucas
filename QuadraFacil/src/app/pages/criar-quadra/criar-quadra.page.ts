import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton, IonIcon,
  IonSelect, IonSelectOption, ToastController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, documentAttachOutline } from 'ionicons/icons';
import { forkJoin, Observable } from 'rxjs';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraModel } from 'src/app/model/foto-quadra.model';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-criar-quadra',
  templateUrl: './criar-quadra.page.html',
  styleUrls: ['./criar-quadra.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonInput, IonButton, IonIcon,
    IonSelect, IonSelectOption, CommonModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class CriarQuadraPage {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('docInput') docInput!: ElementRef<HTMLInputElement>;

  formGroup: FormGroup;
  fotos: string[] = [];
  documentos: string[] = [];

  horasDisponiveis: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private usuarioService: UsuarioService
  ) {
    addIcons({ cameraOutline, documentAttachOutline });

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      endereco: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      horaAbertura: [8, Validators.required],
      horaFechamento: [22, Validators.required]
    });
  }

  // ===== Fotos públicas =====

  selecionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const vagasRestantes = 20 - this.fotos.length;
    const arquivos = Array.from(files).slice(0, vagasRestantes);

    arquivos.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.fotos.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removerFoto(index: number) {
    this.fotos.splice(index, 1);
  }

  // ===== Documentos =====

  selecionarDocumento() {
    this.docInput.nativeElement.click();
  }

  onDocSelected(event: any) {
    const files: FileList = event.target.files;
    const vagasRestantes = 5 - this.documentos.length;
    const arquivos = Array.from(files).slice(0, vagasRestantes);

    arquivos.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.documentos.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removerDocumento(index: number) {
    this.documentos.splice(index, 1);
  }

  // ===== Criar =====

  criar() {
    if (this.fotos.length === 0) {
      this.exibirMensagem('Adicione pelo menos uma foto da quadra.');
      return;
    }
    if (this.documentos.length === 0) {
      this.exibirMensagem('Adicione pelo menos um documento.');
      return;
    }

    const usuario = this.usuarioService.obterSessao();

    const quadra = new QuadraModel();
    quadra.nome = this.formGroup.value.nome;
    quadra.endereco = this.formGroup.value.endereco;
    quadra.horaAbertura = this.formGroup.value.horaAbertura;
    quadra.horaFechamento = this.formGroup.value.horaFechamento;
    quadra.precoAluguel = 0;
    quadra.tipoAcesso = 'PUBLICO';
    quadra.situacao = 'PENDENTE';
    quadra.proprietarioId = usuario.idUsuario;

    this.quadraService.criar(quadra).subscribe({
      next: (quadraCriada) => {
        const uploads: Observable<FotoQuadraModel>[] = [];

        this.fotos.forEach(base64 => {
          const foto = new FotoQuadraModel();
          foto.quadraId = quadraCriada.idQuadra;
          foto.imagemBase64 = base64;
          foto.tipo = 'FOTO';
          uploads.push(this.fotoQuadraService.salvar(foto));
        });

        this.documentos.forEach(base64 => {
          const doc = new FotoQuadraModel();
          doc.quadraId = quadraCriada.idQuadra;
          doc.imagemBase64 = base64;
          doc.tipo = 'DOCUMENTO';
          uploads.push(this.fotoQuadraService.salvar(doc));
        });

        forkJoin(uploads).subscribe({
          next: () => {
            this.exibirMensagem('Quadra criada com sucesso!');
            this.navController.navigateBack('/app/minhas-quadras');
          },
          error: () => this.exibirMensagem('Erro ao enviar fotos/documentos.')
        });
      },
      error: () => this.exibirMensagem('Erro ao criar quadra.')
    });
  }

  voltar() {
    this.navController.navigateBack('/app/minhas-quadras');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({ message: texto, duration: 2000 });
    toast.present();
  }
}