import { Component, OnInit } from '@angular/core';
import { Schedule } from '../models/schedule.model';
import { SchedulesService } from '../services/schedules.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {
  adjustedStartTime: any;
  adjustedEndTime: any;
  notes: string;
  schedule: Schedule;
  checkIn: moment.Moment;
  checkOut: moment.Moment;
  requesForm: boolean = false;
  enableAdjustCheckIn: boolean = false;
  enableAdjustCheckOut: boolean = false;

  constructor(
    private schedulesService: SchedulesService,
    private route: ActivatedRoute, private router: Router,
    private location: Location
  ) { 
    //this.route.queryParams.subscribe(params => {
        this.schedule = this.router.getCurrentNavigation().extras.state.schedule;
        console.log('schedule',this.schedule);
    //});
  }

  ngOnInit() {
    this.checkIn = moment();
    this.checkOut = moment();
    //this.adjustedStartTime = moment(this.schedule.checkIn).toISOString();
    //this.adjustedEndTime =  moment(this.schedule.checkOut).toISOString();
    if (this.schedule.adjustedStartTime) {
      this.adjustedStartTime = moment(this.schedule.adjustedStartTime).toISOString();
    } else {
      this.adjustedStartTime = moment(this.schedule.checkIn).toISOString();
    }

    if (this.schedule.adjustedEndTime) {
      this.adjustedEndTime =  moment(this.schedule.adjustedEndTime).toISOString();
    } else {
      this.adjustedEndTime =  moment(this.schedule.checkOut).toISOString();
    }
  }

  async confirmCheckIn() {
    this.schedule.checkIn = moment(this.checkIn).format('YYYY-MM-DDTHH:mm');
    this.schedulesService.update(this.schedule);
  }
  
  async confirmCheckOut() {
    this.schedule.checkOut = moment(this.checkOut).format('YYYY-MM-DDTHH:mm');;
    this.schedulesService.update(this.schedule);
  }

  changeAdjustmentRequestForm() {
    this.requesForm = !this.requesForm;
  }

  saveAdjustmentRequest() {
    if (this.enableAdjustCheckIn) {
      this.schedule.adjustedStartTime = moment(this.adjustedStartTime).format('YYYY-MM-DDTHH:mm');
      this.schedule.adjustedStartTimeStatus = 'pending';
    }

    if (this.enableAdjustCheckOut) {
      this.schedule.adjustedEndTime = moment(this.adjustedEndTime).format('YYYY-MM-DDTHH:mm');
      this.schedule.adjustedEndTimeStatus = 'pending';
    }

    this.schedulesService.update(this.schedule);
  }

  async closeModal() {
    await this.location.back();
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

  changeAdjustCheckIn() {
    this.enableAdjustCheckIn = !this.enableAdjustCheckIn && !this.schedule.adjustedStartTimeStatus;
  }

  changeAdjustCheckOut() {
    this.enableAdjustCheckOut = !this.enableAdjustCheckOut && !this.schedule.adjustedEndTimeStatus
  }
}