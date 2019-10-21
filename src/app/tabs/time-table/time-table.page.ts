import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { SchedulesService } from '../services/schedules.service';
import { Schedule } from '../models/schedule.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.page.html',
  styleUrls: ['./time-table.page.scss']
})
export class TimeTablePage {
  private schedules = new Array<Schedule>();
  private schedulesSubscription: Subscription;

  schedule: Schedule;

  minDate = new Date().toISOString();

  eventSource = [];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  @ViewChild(CalendarComponent, { static: true }) myCal: CalendarComponent;

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private schedulesService: SchedulesService
  ) {
    this.schedulesSubscription = schedulesService.getAllByLoggedUser().subscribe(data => {
      this.eventSource = [];
      console.log(this.eventSource);
      data.forEach(item => {
        this.schedule = item;
        this.addEvent();
      });
    });
  }

  resetEvent() {
    this.schedule = {
      id: null,
      startTime: new Date(),
      endTime: new Date(),
      location: '',
      effectiveEndTime: new Date(),
      effectiveStartTime: new Date(),
      notes: 'string',
      userId: null
    };
  }

  addEvent() {
    const eventCopy = {
      title: this.schedule.location,
      startTime: new Date(this.schedule.startTime),
      endTime: new Date(this.schedule.endTime),
      allDay: false,
      desc: this.schedule.location
    };

    if (eventCopy.allDay) {
      const start = eventCopy.startTime;
      const end = eventCopy.endTime;

      eventCopy.startTime = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
      );
      eventCopy.endTime = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1)
      );
    }

    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }

  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    console.log(event);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.location,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  onTimeSelected(ev) {
    const selected = new Date(ev.selectedTime);
    this.schedule.startTime = selected;
    selected.setHours(selected.getHours() + 1);
    this.schedule.endTime = selected;
  }
}
