import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Schedule } from '../models/schedule.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService extends Firestore<Schedule> {
  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.setCollection('/schedules');
  }

  private init() {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.setCollection('/schedules');
        return;
      }
      this.setCollection(null);
    });
  }
}
