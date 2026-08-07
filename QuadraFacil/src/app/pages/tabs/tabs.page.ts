import { Component, HostListener } from '@angular/core';
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

  headerEscondido = false;
  private ultimoScrollY = 0;

  constructor() {
    addIcons({ homeOutline, searchOutline, personOutline });
  }

  @HostListener('window:ionScroll', ['$event'])
  onScroll(ev: CustomEvent) {
    const scrollTop = ev.detail?.scrollTop || 0;

    if (scrollTop > this.ultimoScrollY && scrollTop > 40) {
      this.headerEscondido = true;
    } else if (scrollTop < this.ultimoScrollY) {
      this.headerEscondido = false;
    }

    this.ultimoScrollY = scrollTop;
  }
}