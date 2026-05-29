import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
         IonButton, IonIcon, IonTabBar, IonTabButton, IonLabel,
         AlertController, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mapOutline, personOutline, homeOutline, searchOutline } from 'ionicons/icons';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.page.html',
  styleUrls: ['./meu-perfil.page.scss'],
  standalone: true,
  imports: [IonLabel, IonTabButton, IonTabBar, IonIcon, IonButton, IonBackButton,
            IonButtons, IonTitle, IonToolbar, IonHeader, IonContent, CommonModule, TabBarComponent]
})
export class MeuPerfilPage {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  usuario: UsuarioModel | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController,
    private alertController: AlertController
  ) {
    addIcons({ mapOutline, personOutline, homeOutline, searchOutline });
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obterSessao();
  }

  trocarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFotoSelecionada(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.usuarioService.atualizarFoto(base64);
      this.usuario = this.usuarioService.obterSessao();
    };
    reader.readAsDataURL(file);
  }

  async excluirConta() {
    const alert = await this.alertController.create({
      header: 'Excluir conta',
      message: 'Tem certeza? Esta ação não pode ser desfeita.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.usuarioService.excluirConta();
            this.navController.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  irParaConta() {
    this.navController.navigateBack('/conta');
  }
}