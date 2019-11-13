import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Schedule } from '../../models/schedule.model';
import { SchedulesService } from '../../services/schedules.service';

@Component({
  selector: 'app-time-table-modal',
  templateUrl: './time-table-modal.page.html',
  styleUrls: ['./time-table-modal.page.scss']
})
export class TimeTableModalPage implements OnInit {
  effectiveStartTime: any;
  effectiveEndTime: any;
  notes: string;
  schedule: Schedule;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private schedulesService: SchedulesService
  ) { }

  ngOnInit() {
    this.schedule = this.navParams.data.schedule;

    if (this.schedule.effectiveStartTime) {
      this.effectiveStartTime = new Date(
        this.navParams.data.schedule.effectiveStartTime
      ).toISOString();
    } else {
      this.effectiveStartTime = new Date(this.navParams.data.schedule.startTime).toISOString();
    }

    if (this.schedule.effectiveEndTime) {
      this.effectiveEndTime = new Date(this.navParams.data.schedule.effectiveEndTime).toISOString();
    } else {
      this.effectiveEndTime = new Date(this.navParams.data.schedule.endTime).toISOString();
    }
  }

  async confirmCheckin() {
    this.schedule.effectiveStartTime = this.effectiveStartTime === undefined ? null : this.effectiveStartTime;
    this.schedule.effectiveEndTime = this.effectiveEndTime === undefined ? null : this.effectiveEndTime;

    this.schedulesService.update(this.schedule);
    await this.modalController.dismiss();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
