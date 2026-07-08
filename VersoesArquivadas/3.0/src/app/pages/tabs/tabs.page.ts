import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon,
         IonLabel, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, searchOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon,
            IonLabel, IonHeader, IonToolbar, IonTitle]
})
export class TabsPage {
  constructor() {
    addIcons({ homeOutline, searchOutline, personOutline });
  }
}