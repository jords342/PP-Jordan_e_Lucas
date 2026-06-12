import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-meus-amigos',
  templateUrl: './meus-amigos.page.html',
  styleUrls: ['./meus-amigos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MeusAmigosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
