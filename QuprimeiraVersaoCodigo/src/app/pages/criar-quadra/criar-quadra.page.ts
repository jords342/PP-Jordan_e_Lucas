import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-criar-quadra',
  templateUrl: './criar-quadra.page.html',
  styleUrls: ['./criar-quadra.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CriarQuadraPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
