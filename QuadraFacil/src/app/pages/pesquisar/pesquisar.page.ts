import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.page.html',
  styleUrls: ['./pesquisar.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, CommonModule, FormsModule]
})
export class PesquisarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}