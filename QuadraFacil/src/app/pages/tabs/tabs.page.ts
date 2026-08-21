import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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
export class TabsPage implements OnInit, OnDestroy {

  headerEscondido = false;
  private ultimoScrollY = 0;
  private scrollListener: any;

  constructor(private ngZone: NgZone) {
    addIcons({ homeOutline, searchOutline, personOutline });
  }

  ngOnInit() {
    this.scrollListener = (ev: any) => {
      const scrollTop = ev.detail?.scrollTop || 0;

      this.ngZone.run(() => {
        // Se estiver no topo da tela (início), SEMPRE mostra o cabeçalho
        if (scrollTop <= 5) {
          this.headerEscondido = false;
        } 
        // Rolou para baixo mais de 20px -> Esconde o cabeçalho
        else if (scrollTop > this.ultimoScrollY && scrollTop > 20) {
          this.headerEscondido = true;
        } 
        // Rolou para cima minimamente -> Reaparece imediatamente
        else if (scrollTop < this.ultimoScrollY) {
          this.headerEscondido = false;
        }

        this.ultimoScrollY = scrollTop;
      });
    };

    document.addEventListener('ionScroll', this.scrollListener, true);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      document.removeEventListener('ionScroll', this.scrollListener, true);
    }
  }
}