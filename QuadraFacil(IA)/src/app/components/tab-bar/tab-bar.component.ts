import { Component } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, searchOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabBarComponent {
  constructor(private navController: NavController) {
    addIcons({ homeOutline, searchOutline, personOutline });
  }

  irParaConta() {
    this.navController.navigateRoot('/conta');
  }
}