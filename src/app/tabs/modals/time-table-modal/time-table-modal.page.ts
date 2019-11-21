import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Schedule } from '../../models/schedule.model';
import { SchedulesService } from '../../services/schedules.service';
import * as moment from 'moment';

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
  checkIn: moment.Moment;
  checkOut: moment.Moment;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private schedulesService: SchedulesService
  ) { }

  ngOnInit() {
    this.schedule = this.navParams.data.schedule;

    this.checkIn = moment();
    this.checkOut = moment();

    console.log(this.schedule);
    //if (this.schedule.effectiveStartTime) {
    //  this.effectiveStartTime = new Date(
    //    this.navParams.data.schedule.effectiveStartTime
    //  ).toISOString();
    //} else {
    //  this.effectiveStartTime = new Date(this.navParams.data.schedule.startTime).toISOString();
   // }

    //if (this.schedule.effectiveEndTime) {
    //  this.effectiveEndTime = new Date(this.navParams.data.schedule.effectiveEndTime).toISOString();
    //} else {
    //  this.effectiveEndTime = new Date(this.navParams.data.schedule.endTime).toISOString();
   // }
  }

  async confirmCheckIn() {
    this.schedule.checkIn = moment(this.checkIn).format('YYYY-MM-DDTHH:mm');
    console.log(this.schedule)
    this.schedulesService.update(this.schedule);
    //await this.modalController.dismiss();
  }
  
  async confirmCheckOut() {
    this.schedule.checkOut = moment(this.checkOut).format('YYYY-MM-DDTHH:mm');;
    console.log(this.schedule)
    this.schedulesService.update(this.schedule);
    //await this.modalController.dismiss();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  onCheckInChange() {
    if(this.checkIn) {
      this.schedule.checkIn = moment().format('DD/MM/YYYY HH:MM');
    } else {
      this.schedule.checkIn = '';
    }
  }

  onCheckOutChange() {
    if (this.checkOut) {
      this.schedule.checkOut = moment().format('DD/MM/YYYY HH:MM');
    } else {
      this.schedule.checkOut = '';
    }
  }
}
