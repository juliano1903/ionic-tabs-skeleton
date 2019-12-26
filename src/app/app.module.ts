import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { TimeTableModalPageModule } from './tabs/modals/time-table-modal/time-table-modal.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicModule } from '@ionic/angular';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

// the second parameter 'fr' is optional
registerLocaleData(localeIt);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    CoreModule,
    AppRoutingModule, 
    TimeTableModalPageModule, 
    IonicModule.forRoot({mode: 'md'}), 
    ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production })
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
   ],
   providers: [
    { provide: LOCALE_ID, useValue: 'it' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
