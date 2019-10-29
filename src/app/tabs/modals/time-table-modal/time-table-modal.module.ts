import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TimeTableModalPage } from './time-table-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TimeTableModalPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TimeTableModalPage]
})
export class TimeTableModalPageModule {}
