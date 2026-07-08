import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-minhas-quadras',
  templateUrl: './minhas-quadras.page.html',
  styleUrls: ['./minhas-quadras.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule]
})
export class MinhasQuadrasPage implements OnInit {

  constructor(private navController: NavController) {}

  ngOnInit() {}

  irParaCriarQuadra() {
    this.navController.navigateForward('/app/criar-quadra');
  }

}
