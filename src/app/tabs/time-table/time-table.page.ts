import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { SchedulesService } from '../services/schedules.service';
import { Schedule } from '../models/schedule.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { OverlayService } from 'src/app/core/services/overlay.service';
import * as moment from 'moment';


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
  dataReturned: any;

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private schedulesService: SchedulesService,
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    private overlayService: OverlayService
  ) {
  }

  ionViewWillEnter(): void {
    this.authService.isAuthenticated.subscribe(
      logged => this.redirect(logged))
  }

  private redirect(logged: boolean) {
    const urlRedirect = "tabs"
    if (!logged) {
      this.overlayService.toast({
        message: "You aren't logged. Please relogin."
      });
      this.router.navigate(['/login'], {
        queryParams: { urlRedirect }
      });
    }
  }

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();

    this.schedulesSubscription = this.schedulesService.getAllByLoggedUser().subscribe(data => {
      this.eventSource = [];
      data.forEach(item => {
        this.schedule = item;
        this.addEvent();
      });
      loading.dismiss();
    });
    this.myCal.loadEvents();    
  }

  resetEvent() {
    this.schedule = {
      id: null,
      startTime: new Date(),
      endTime: new Date(),
      location: '',
      notes: 'string',
      userId: null,
      specialty: '',
      hospitalId: '',
      hospitalName: '',
      disabled: false
    };
  }

  addEvent() {
    const startTime = new Date(this.schedule.startTime);
    const endTime = new Date(this.schedule.endTime);

    const eventCopy = {
      title: this.schedule.hospitalName,
      startTime: startTime,
      endTime: startTime,
      endTimeReal: endTime,
      allDay: false,
      desc: this.schedule.hospitalName,
      schedule: this.schedule
    };

    this.eventSource.push(eventCopy);
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
  async onEventSelected_(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.location,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  async onEventSelected(event) {
    let navigationExtras: NavigationExtras = {
      state: {
        schedule: event.schedule
      }
    };
    this.router.navigate(['/checkin'], navigationExtras);
  }

  onTimeSelected(ev) {
    if(this.schedule) {
      const selected = new Date(ev.selectedTime);
      this.schedule.startTime = selected;
      selected.setHours(selected.getHours() + 1);
      this.schedule.endTime = selected;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login", { skipLocationChange: true });
  }
}
