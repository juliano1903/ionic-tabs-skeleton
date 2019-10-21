import { Injectable } from '@angular/core';
import { User } from 'src/app/core/services/auth.types';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AuthService } from 'src/app/core/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends Firestore<User> {
  constructor(private authService: AuthService, db: AngularFirestore) {
    super(db);
    this.setCollection('/users');
  }

  getLoggedUser(): Observable<User> {
    return this.get(this.authService.currentUserId());
  }
}
