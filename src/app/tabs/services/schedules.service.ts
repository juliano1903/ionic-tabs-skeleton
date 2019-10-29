import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Schedule } from '../models/schedule.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, combineLatest, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService extends Firestore<Schedule> {
  caOrCoCities$: Observable<Schedule[]>;

  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.init();
  }

  public updateSchedule(schedule: Schedule): void {
    this.update(schedule);
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

  public getAllByLoggedUser(): Observable<Schedule[]> {
    return this.db
      .collection<Schedule>('/schedules', ref =>
        ref.where('userId', '==', this.authService.currentUserId())
      )
      .valueChanges();
  }

  public getAllByLoggedUserAndAvailable(): Observable<Schedule[]> {
    return this.orQuery();
  }

  orQuery(): Observable<Schedule[]> {
    console.log(this.authService.currentUserId());

    const $one = this.db
      .collection<Schedule>('/schedules', ref =>
        ref.where('userId', '==', this.authService.currentUserId())
      )
      .valueChanges();

    const $two = this.db
      .collection<Schedule>('/schedules', ref => ref.where('userId', '==', ''))
      .valueChanges();

    const $three = this.db
      .collection<Schedule>('/schedules', ref => ref.where('userId', '==', null))
      .valueChanges();

    return combineLatest($one, $two, $three).pipe(
      map(([one, two, three]) => [...one, ...two, ...three])
    );
  }
}
