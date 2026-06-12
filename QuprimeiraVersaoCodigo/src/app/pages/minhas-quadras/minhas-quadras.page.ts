import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-minhas-quadras',
  templateUrl: './minhas-quadras.page.html',
  styleUrls: ['./minhas-quadras.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MinhasQuadrasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
