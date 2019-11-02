import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';
import { SchedulesService } from '../services/schedules.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from '../services/users.service';
import { User } from 'src/app/core/services/auth.types';
import { Contract } from '../models/contract.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.page.html',
  styleUrls: ['./schedule-list.page.scss']
})
export class ScheduleListPage {
  schedules$: Schedule[];
  user: User;
  contracts: Contract[];

  constructor(
    private schedulesService: SchedulesService,
    private overlayService: OverlayService,
    private authService: AuthService,
    private usersService: UsersService,
    private navCtrl: NavController
  ) {}

  ionViewDidEnter(): void {
    this.schedulesService.getAll().subscribe(data => {
      this.usersService.getLoggedUser().subscribe(user => {
        this.user = user;
        this.usersService.getContracts(this.authService.currentUserId()).subscribe(contracts => {
          this.contracts = contracts;
          this.applyFilters(data);
        });
      });
    });
  }

  applyFilters(data) {
    console.log(JSON.stringify(this.contracts).toLowerCase());
    this.schedules$ = data.filter(
      s =>
        (s.userId === null || s.userId === '' || s.userId === this.authService.currentUserId()) &&
        this.user.specialties.includes(s.specialty) &&
        JSON.stringify(this.contracts)
          .toLowerCase()
          .indexOf(s.hospitalId.toLowerCase()) > 0
    );
  }

  changeApply(schedule: Schedule) {
    if (schedule.userId) {
      this.presentAlertDismissConfirmation(schedule);
    } else {
      this.presentAlertApplyConfirmation(schedule);
    }
  }

  async presentAlertDismissConfirmation(schedule: Schedule) {
    const alert = await this.overlayService.alert({
      header: 'Dismiss!',
      message:
        'Confirm dismiss for ' +
        schedule.location +
        '<p>At ' +
        moment(new Date(schedule.startTime)).format('MM/DD/YYYY HH:mm') +
        '</p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Confirm Okay');
            schedule.userId = null;
            this.schedulesService.updateSchedule(schedule);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertApplyConfirmation(schedule: Schedule) {
    const alert = await this.overlayService.alert({
      header: 'Apply!',
      message:
        'Confirm apply for ' +
        schedule.location +
        '<p>At ' +
        moment(new Date(schedule.startTime)).format('MM/DD/YYYY HH:mm') +
        '</p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Confirm Okay');
            schedule.userId = this.authService.currentUserId();
            this.schedulesService.updateSchedule(schedule);
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateForward('/login');
  }
}
