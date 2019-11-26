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
  effectiveStartTime: any;
  effectiveEndTime: any;
  notes: string;
  schedule: Schedule;
  checkIn: moment.Moment;
  checkOut: moment.Moment;

  constructor(
    private schedulesService: SchedulesService,
    private route: ActivatedRoute, private router: Router,
    private location: Location
  ) { 
    //this.route.queryParams.subscribe(params => {
        this.schedule = this.router.getCurrentNavigation().extras.state.schedule;
        console.log(this.schedule);
    //});
  }

  ngOnInit() {
    this.checkIn = moment();
    this.checkOut = moment();
  }

  async confirmCheckIn() {
    this.schedule.checkIn = moment(this.checkIn).format('YYYY-MM-DDTHH:mm');
    this.schedulesService.update(this.schedule);
  }
  
  async confirmCheckOut() {
    this.schedule.checkOut = moment(this.checkOut).format('YYYY-MM-DDTHH:mm');;
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
}