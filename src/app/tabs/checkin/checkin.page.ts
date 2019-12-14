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
  adjustedCheckin: any;
  adjustedCheckout: any;
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
      this.schedule = this.router.getCurrentNavigation().extras.state.schedule;
      this.enableAdjustCheckIn = this.schedule.adjustedCheckinStatus == 'pending';
      this.enableAdjustCheckOut = this.schedule.adjustedCheckoutStatus == 'pending';
  }

  ngOnInit() {
    this.checkIn = moment();
    this.checkOut = moment();
    if (this.schedule.adjustedCheckin) {
      this.adjustedCheckin = moment(this.schedule.adjustedCheckin).toISOString();
    } else {
      this.adjustedCheckin = moment(this.schedule.checkIn).toISOString();
    }

    if (this.schedule.adjustedCheckout) {
      this.adjustedCheckout =  moment(this.schedule.adjustedCheckout).toISOString();
    } else {
      this.adjustedCheckout =  moment(this.schedule.checkOut).toISOString();
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
      this.schedule.adjustedCheckin = moment(this.adjustedCheckin).format('YYYY-MM-DDTHH:mm');
      this.schedule.adjustedCheckinStatus = 'pending';
    }

    if (this.enableAdjustCheckOut) {
      this.schedule.adjustedCheckout = moment(this.adjustedCheckout).format('YYYY-MM-DDTHH:mm');
      this.schedule.adjustedCheckoutStatus = 'pending';
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
    this.enableAdjustCheckIn = !this.enableAdjustCheckIn && !this.schedule.adjustedCheckinStatus && this.isBefore24Hours(this.schedule.checkIn);
  }

  changeAdjustCheckOut() {
    this.enableAdjustCheckOut = !this.enableAdjustCheckOut && !this.schedule.adjustedCheckoutStatus && this.isBefore24Hours(this.schedule.checkOut);
  }

  isBefore24Hours(date: string) {
    return moment.duration(moment(new Date()).diff(date)).asHours() < 24; 
  }
}