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
    private navCtrl: NavController
  ) {}

  ionViewDidEnter(): void {
    this.dateFilter = new Array();
    var date = new Date();
    
    this.selectedDate = moment();

    this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() - 2 ));
    this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() - 1 ));
    this.dateFilter.push(new Date(date.getFullYear(), date.getMonth()));
    this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() + 1 ));
    this.dateFilter.push(new Date(date.getFullYear(), date.getMonth() + 2 ));

    this.schedulesService.getAllByLoggedUser().subscribe(data => {
      this.usersService.getLoggedUser().subscribe(user => {
        this.user = user;
        this.usersService.getContracts(this.authService.currentUserId()).subscribe(contracts => {
          this.contracts = contracts;
          this.schedules$ = data;
          this.applyFilters(data);
        });
      });
    });
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
    });
  }

  getEffectiveMinutes(schedule) {
    console.log(moment
      .duration(moment(schedule.checkOut).diff(schedule.checkIn))
      .asHours());

    const startDate = moment
      .duration(moment(schedule.startDate).diff(schedule.checkIn))
      .asMinutes() > 15 ? schedule.checkIn : schedule.startDate;

    const endDate = moment
      .duration(moment(schedule.endDate).diff(schedule.checkOut))
      .asMinutes() > 15 ? schedule.checkOut : schedule.endDate;

    return moment
    .duration(moment(endDate).diff(startDate))
    .asHours();
  }

  onChange() {
    this.contracts.forEach(contract => {
      contract.schedules = null;
    })
    this.totalPredicted = 0;
    this.totalReceived = 0;
    this.applyFilters(this.schedules$);
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateForward('/login');
  }
}
