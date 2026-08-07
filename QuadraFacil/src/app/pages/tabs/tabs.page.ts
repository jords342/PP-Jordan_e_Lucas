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
    // Escuta o evento ionScroll na fase de captura do documento (funciona no Ionic Shadow DOM)
    this.scrollListener = (ev: any) => {
      const scrollTop = ev.detail?.scrollTop || 0;

      this.ngZone.run(() => {
        // Rola para baixo mais de 30px -> Esconde o cabeçalho
        if (scrollTop > this.ultimoScrollY && scrollTop > 30) {
          this.headerEscondido = true;
        } 
        // Rola para cima -> Mostra o cabeçalho
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