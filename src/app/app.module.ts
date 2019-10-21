import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { TimeTableModalPageModule } from './tabs/modals/time-table-modal/time-table-modal.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [CoreModule, AppRoutingModule, TimeTableModalPageModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
