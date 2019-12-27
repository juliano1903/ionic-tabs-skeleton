import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SchedulesService } from '../services/schedules.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from '../services/users.service';
import { Schedule } from '../models/schedule.model';
import { Contract } from '../models/contract.model';
import { User } from 'src/app/core/services/auth.types';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss']
})
export class BalancePage {
  schedules$: Schedule[];
  user: User;
  contracts: Contract[];
  dateFilter: Array<Date>;
  selectedDate: moment.Moment;
  totalPredicted: number = 0;
  totalReceived: number = 0;

  constructor(
    private schedulesService: SchedulesService,
    private overlayService: OverlayService,
    private authService: AuthService,
    private usersService: UsersService,
    private navCtrl: NavController,
    private router: Router,
  ) {}

  ionViewWillEnter(): void {

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
     try {
       this.authService.isAuthenticated.subscribe(
         logged => this.redirect(logged));
   
   
       this.dateFilter = new Array();
       var date = new Date();
       
       this.selectedDate = moment();
   
       this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() - 4 ));
       this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() - 3 ));
       this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() - 2 ));
       this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() - 1 ));
       this.dateFilter.push(new Date(date.getFullYear(), date.getMonth()));
   
       this.schedulesService.getAllByLoggedUser().subscribe(data => {
         this.usersService.getLoggedUser().subscribe(user => {
           this.user = user;
           this.usersService.getContracts(this.authService.currentUserId()).subscribe(contracts => {
             this.contracts = contracts;
             this.schedules$ = data;
             this.applyFilters(data);
           });
         });
         loading.dismiss();
       });
    } finally {
      loading.dismiss();
    }
  }

  applyFilters(data: Schedule[]) {
    this.totalPredicted = 0;
    this.totalReceived = 0;

    var nextMonth = moment(this.selectedDate).add(1 ,'M').startOf('month');
    var actualMonth = moment(this.selectedDate).startOf('month');

    this.contracts.forEach(contract => {
      contract.predictedValue = 0;
      contract.receivedValue = 0;
      const schedulesContract = data.filter(
        s => contract.hospitalId === s.hospitalId && contract.specialty === s.specialty 
        && moment(s.startTime).isAfter(actualMonth)
        && moment(s.startTime).isBefore(nextMonth)
      );

      schedulesContract.forEach(schedule => {
        if (schedule.checkIn && schedule.checkOut) {
          const effectiveMinutes = this.getEffectiveMinutes(schedule);

          schedule.receivedAmount = (schedule.price ? schedule.price : contract.price) * effectiveMinutes;
          contract.receivedValue += schedule.receivedAmount;
        } else {
          const predictedMinutes = moment
            .duration(moment(schedule.endTime).diff(schedule.startTime))
            .asHours();
          schedule.predictedAmount = (schedule.price? schedule.price : contract.price) * predictedMinutes;
          contract.predictedValue += schedule.predictedAmount;
        }
      });

      this.totalPredicted += contract.predictedValue;
      this.totalReceived += contract.receivedValue;

      if (contract.schedules) {
        contract.schedules.concat(schedulesContract);
      } else {
        contract.schedules = schedulesContract;
      }
      contract.schedules.sort(function(a,b) {
        return a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0;
      });
    });
  }

  getEffectiveMinutes(schedule: Schedule) {
    let startDate;
    let endDate;
    if (schedule.adjustedCheckinStatus && schedule.adjustedCheckinStatus == 'approved') {
      startDate = this.has15MinutesDiference(schedule.startTime, schedule.adjustedCheckin) ? schedule.adjustedCheckin : schedule.startTime;
    } else {
      startDate = this.has15MinutesDiference(schedule.checkIn, schedule.startTime) ? schedule.checkIn : schedule.startTime;
    }

    if (schedule.adjustedCheckoutStatus && schedule.adjustedCheckoutStatus == 'approved') {
      endDate = this.has15MinutesDiference(schedule.adjustedCheckout, schedule.endTime) ? schedule.adjustedCheckout : schedule.endTime;
    } else {
      endDate = this.has15MinutesDiference(schedule.checkOut, schedule.endTime) ? schedule.checkOut : schedule.endTime;
    }

    return moment
    .duration(moment(endDate).diff(startDate))
    .asHours();
  }

  onChangeFilter() {
    if( this.contracts) {
      this.contracts.forEach(contract => {
        contract.schedules = null;
      })
      this.totalPredicted = 0;
      this.totalReceived = 0;
      this.applyFilters(this.schedules$);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login", { skipLocationChange: true });
  }

  has15MinutesDiference(initialDate, adjustedDate) {
    const diferenceMinutes = moment
      .duration(moment(initialDate).diff(adjustedDate))
      .asMinutes();
      return diferenceMinutes > 15 || (diferenceMinutes * -1) > 15;
  }
}
