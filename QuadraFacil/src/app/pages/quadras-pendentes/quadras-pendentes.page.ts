import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-quadras-pendentes',
  templateUrl: './quadras-pendentes.page.html',
  styleUrls: ['./quadras-pendentes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QuadrasPendentesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
