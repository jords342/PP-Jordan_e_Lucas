import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton, IonIcon,
  IonSelect, IonSelectOption, ToastController
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { cameraOutline, documentAttachOutline } from 'ionicons/icons';
import { forkJoin, Observable, of } from 'rxjs';

import { QuadraModel } from 'src/app/model/quadra.model';
import { QuadraService } from 'src/app/services/quadra.service';
import { FotoQuadraModel } from 'src/app/model/foto-quadra.model';
import { FotoQuadraService } from 'src/app/services/foto-quadra.service';

@Component({
  selector: 'app-editar-quadra',
  templateUrl: './editar-quadra.page.html',
  styleUrls: ['./editar-quadra.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonInput, IonButton, IonIcon,
    IonSelect, IonSelectOption, CommonModule, ReactiveFormsModule
  ]
})
export class EditarQuadraPage {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('docInput') docInput!: ElementRef<HTMLInputElement>;

  quadra: QuadraModel = new QuadraModel();
  formGroup: FormGroup;

  // Fotos que já existem no banco
  fotos: FotoQuadraModel[] = [];
  documentos: FotoQuadraModel[] = [];

  // Fotos novas (base64) que ainda não foram salvas
  fotosNovas: string[] = [];
  documentosNovos: string[] = [];

  horasDisponiveis: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private route: ActivatedRoute,
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService
  ) {
    addIcons({ cameraOutline, documentAttachOutline });

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      endereco: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      horaAbertura: [8, Validators.required],
      horaFechamento: [22, Validators.required]
    });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

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

    this.carregarFotos(id);
    this.carregarDocumentos(id);
  }

  carregarFotos(quadraId: string) {
    this.fotoQuadraService.listarPorQuadra(quadraId, 'FOTO').subscribe({
      next: (fotos) => this.fotos = fotos
    });
  }

  carregarDocumentos(quadraId: string) {
    this.fotoQuadraService.listarPorQuadra(quadraId, 'DOCUMENTO').subscribe({
      next: (docs) => this.documentos = docs
    });
  }

  // ===== Fotos existentes =====

  removerFotoExistente(index: number) {
    const foto = this.fotos[index];
    if (!foto) return;

    this.fotoQuadraService.excluir(foto.idFoto).subscribe({
      next: () => this.fotos.splice(index, 1),
      error: () => this.exibirMensagem('Erro ao remover foto.')
    });
  }

  // ===== Documentos existentes =====

  removerDocumentoExistente(index: number) {
    const doc = this.documentos[index];
    if (!doc) return;

    this.fotoQuadraService.excluir(doc.idFoto).subscribe({
      next: () => this.documentos.splice(index, 1),
      error: () => this.exibirMensagem('Erro ao remover documento.')
    });
  }

  // ===== Fotos novas =====

  selecionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const totalAtual = this.fotos.length + this.fotosNovas.length;
    const vagasRestantes = 20 - totalAtual;
    const arquivos = Array.from(files).slice(0, vagasRestantes);

    arquivos.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.fotosNovas.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removerFotoNova(index: number) {
    this.fotosNovas.splice(index, 1);
  }

  // ===== Documentos novos =====

  selecionarDocumento() {
    this.docInput.nativeElement.click();
  }

  onDocSelected(event: any) {
    const files: FileList = event.target.files;
    const totalAtual = this.documentos.length + this.documentosNovos.length;
    const vagasRestantes = 5 - totalAtual;
    const arquivos = Array.from(files).slice(0, vagasRestantes);

    arquivos.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.documentosNovos.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removerDocumentoNovo(index: number) {
    this.documentosNovos.splice(index, 1);
  }

  // ===== Salvar =====

  salvar() {
    if (!this.formGroup.valid) return;

    const totalFotos = this.fotos.length + this.fotosNovas.length;
    const totalDocs = this.documentos.length + this.documentosNovos.length;

    if (totalFotos === 0) {
      this.exibirMensagem('A quadra precisa ter pelo menos uma foto.');
      return;
    }
    if (totalDocs === 0) {
      this.exibirMensagem('A quadra precisa ter pelo menos um documento.');
      return;
    }

    // 1. Atualiza os dados da quadra
    this.quadra.nome = this.formGroup.value.nome;
    this.quadra.endereco = this.formGroup.value.endereco;
    this.quadra.horaAbertura = this.formGroup.value.horaAbertura;
    this.quadra.horaFechamento = this.formGroup.value.horaFechamento;

    this.quadraService.alterar(this.quadra).subscribe({
      next: () => {
        // 2. Sobe as novas fotos e documentos
        const uploads: Observable<FotoQuadraModel>[] = [];

        this.fotosNovas.forEach(base64 => {
          const foto = new FotoQuadraModel();
          foto.quadraId = this.quadra.idQuadra;
          foto.imagemBase64 = base64;
          foto.tipo = 'FOTO';
          uploads.push(this.fotoQuadraService.salvar(foto));
        });

        this.documentosNovos.forEach(base64 => {
          const doc = new FotoQuadraModel();
          doc.quadraId = this.quadra.idQuadra;
          doc.imagemBase64 = base64;
          doc.tipo = 'DOCUMENTO';
          uploads.push(this.fotoQuadraService.salvar(doc));
        });

        const upload$ = uploads.length > 0 ? forkJoin(uploads) : of([]);

        upload$.subscribe({
          next: () => {
            this.exibirMensagem('Quadra atualizada com sucesso!');
            this.navController.navigateBack(`/app/quadra/${this.quadra.idQuadra}`);
          },
          error: () => this.exibirMensagem('Erro ao enviar novas fotos/documentos.')
        });
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