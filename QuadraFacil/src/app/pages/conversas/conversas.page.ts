import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-meus-amigos',
  templateUrl: './conversas.page.html',
  styleUrls: ['./conversas.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ConversasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}