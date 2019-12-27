import { Injectable } from '@angular/core';
import { Firestore } from 'src/app/core/classes/firestore.class';
import '@firebase/messaging';
import { NotificationMessage } from '../models/notificationMessage.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends Firestore<NotificationMessage> {

    constructor(private authService: AuthService,  db: AngularFirestore) {
        super(db);
        this.init();
    }

    private init() {
        this.authService.authState$.subscribe(user => {
          if (user) {
            this.setCollection('/notifications');
            return;
          }
          this.setCollection(null);
        });
    }
}
