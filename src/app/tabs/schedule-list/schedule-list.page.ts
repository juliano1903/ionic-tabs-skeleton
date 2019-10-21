import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';
import { SchedulesService } from '../services/schedules.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.page.html',
  styleUrls: ['./schedule-list.page.scss']
})
export class ScheduleListPage {
  schedules$: Observable<Schedule[]>;
  constructor(private schedulesService: SchedulesService) {}

  ionViewDidEnter(): void {
    this.schedules$ = this.schedulesService.getAll();
    console.log(this.schedules$);
  }
}
