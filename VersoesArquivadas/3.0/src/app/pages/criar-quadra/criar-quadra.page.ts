import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon,
         ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';

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
  imports: [IonContent, IonInput, IonButton, IonIcon,
            CommonModule, FormsModule, ReactiveFormsModule]
})
export class CriarQuadraPage {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  formGroup: FormGroup;
  fotos: string[] = []; // lista de base64

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private quadraService: QuadraService,
    private fotoQuadraService: FotoQuadraService,
    private usuarioService: UsuarioService
  ) {
    addIcons({ cameraOutline });

    this.formGroup = this.formBuilder.group({
      nome:     ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      endereco: ['', Validators.compose([Validators.required, Validators.minLength(5)])]
    });
  }

  selecionarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const vagasRestantes = 20 - this.fotos.length;
    const arquivos = Array.from(files).slice(0, vagasRestantes);

    arquivos.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotos.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    // limpa o input para permitir selecionar os mesmos arquivos novamente
    event.target.value = '';
  }

  removerFoto(index: number) {
    this.fotos.splice(index, 1);
  }

  criar() {
    const usuario = this.usuarioService.obterSessao();

    const quadra = new QuadraModel();
    quadra.nome         = this.formGroup.value.nome;
    quadra.endereco     = this.formGroup.value.endereco;
    quadra.horario      = '';
    quadra.precoAluguel = 0;
    quadra.tipoAcesso   = 'PUBLICO';
    quadra.situacao     = 'PENDENTE';
    quadra.proprietarioId = usuario.idUsuario;

    this.quadraService.criar(quadra).subscribe({
      next: (quadraCriada) => {
        // salva as fotos uma por uma
        const uploads = this.fotos.map(base64 => {
          const foto = new FotoQuadraModel();
          foto.quadraId      = quadraCriada.idQuadra;
          foto.imagemBase64  = base64;
          return this.fotoQuadraService.salvar(foto).toPromise();
        });

        Promise.all(uploads).then(() => {
          this.exibirMensagem('Quadra criada com sucesso!');
          this.navController.navigateBack('/app/minhas-quadras');
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