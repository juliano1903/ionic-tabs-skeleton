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
import { Router } from '@angular/router';

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
    private navCtrl: NavController,
    private router: Router,
  ) { }

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

    this.schedulesService.getAll().subscribe(data => {
      this.usersService.getLoggedUser().subscribe(user => {
        this.user = user;
        this.user.id = this.authService.currentUserId();
        this.usersService.getContracts(this.user.id).subscribe(contracts => {
          this.contracts = contracts;
          this.applyFilters(data);
          this.schedules$.sort((a, b) => {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          });
          loading.dismiss();
        });
      });
    });
  }

  applyFilters(data: Schedule[]) {
    this.schedules$ = data.filter(
      s =>
        (!s.userId ||
          s.userId === null ||
          s.userId === '' ||
          s.userId === this.authService.currentUserId()) &&
        !s.disabled &&
        this.userHasAutorization(s) &&
        !this.isEffectived(s) &&
        moment(s.startTime).isAfter(moment().startOf('month'))
    );
  }

  userHasAutorization(schedule: Schedule): boolean {
    return (
      this.contracts.filter(
        f => f.hospitalId === schedule.hospitalId && f.specialty === schedule.specialty
      ).length > 0
    );
  }

  scheduleContract(schedule: Schedule): Contract {
    return (
      this.contracts.filter(
        f => f.hospitalId === schedule.hospitalId && f.specialty === schedule.specialty
      )[0]
    );
  }

  isEffectived(s: Schedule) {
    return s.checkIn || s.checkOut
  }

  changeApply(schedule: Schedule) {
    if (schedule.dismissRequested) {
      this.presentAlertCancelDismissConfirmation(schedule);
    } else if (schedule.userId) {
      this.presentAlertDismissConfirmation(schedule);
    } else {
      this.presentAlertApplyConfirmation(schedule);
    }
  }

  async presentAlertDismissConfirmation(schedule: Schedule) {
    const alert = await this.overlayService.alert({
      header: 'Dismiss!',
      message:
        'A dismiss request is going to be sent to admin!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            schedule.dismissRequested = true;
            this.schedulesService.updateSchedule(schedule);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertCancelDismissConfirmation(schedule: Schedule) {
    const alert = await this.overlayService.alert({
      header: 'Dismiss!',
      message:
        'A dismiss request is pending. Do you want to cancel that request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            schedule.dismissRequested = false;
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
        schedule.hospitalName +
        '<p>At ' +
        moment(new Date(schedule.startTime)).format('MM/DD/YYYY HH:mm') +
        '</p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            schedule.userId = this.user.id;
            schedule.userName = this.user.name; 
            schedule.price = this.scheduleContract(schedule).price;
            this.schedulesService.updateSchedule(schedule);
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login", { skipLocationChange: true });
  }
}
