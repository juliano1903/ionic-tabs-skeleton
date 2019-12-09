import { Component, OnInit } from '@angular/core';
import { Schedule } from '../models/schedule.model';
import { SchedulesService } from '../services/schedules.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OverlayService } from 'src/app/core/services/overlay.service';

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
    private location: Location,
    private overlayService: OverlayService
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
    await this.overlayService.toast({
      message: "Check-in realized at: " + moment(this.checkIn).format('DD/MM/YYYY HH:mm')
    });
  }
  
  async confirmCheckOut() {
    this.schedule.checkOut = moment(this.checkOut).format('YYYY-MM-DDTHH:mm');;
    this.schedulesService.update(this.schedule);
    await this.overlayService.toast({
      message: "Check-out realized at: " + moment(this.checkOut).format('DD/MM/YYYY HH:mm')
    });
  }

  changeAdjustmentRequestForm() {
    this.requesForm = !this.requesForm;
  }

  async saveAdjustmentRequest() {
    if (this.enableAdjustCheckIn) {
      this.schedule.adjustedStartTime = moment(this.adjustedStartTime).format('YYYY-MM-DDTHH:mm');
      this.schedule.adjustedStartTimeStatus = 'pending';
      this.enableAdjustCheckIn = !this.enableAdjustCheckIn;
    }

    if (this.enableAdjustCheckOut) {
      this.schedule.adjustedEndTime = moment(this.adjustedEndTime).format('YYYY-MM-DDTHH:mm');
      this.schedule.adjustedEndTimeStatus = 'pending';
      this.enableAdjustCheckOut = !this.enableAdjustCheckOut;
    }

    this.schedulesService.update(this.schedule);
    await this.overlayService.toast({
      message: "Your adjustment request was sent to administrator."
    });
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