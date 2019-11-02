import { Injectable } from '@angular/core';
import { User } from 'src/app/core/services/auth.types';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AuthService } from 'src/app/core/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends Firestore<User> {
  constructor(
    private authService: AuthService,
    db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    super(db);
    this.setCollection('/users');
  }

  user: Observable<User>;

  getLoggedUser(): Observable<User> {
    return this.get(this.authService.currentUserId());
  }

  getContracts(id: string): Observable<Contract[]> {
    return this.db
      .collection<User>('users')
      .doc<User>(id)
      .collection<Contract>('contracts', ref => ref.where('disabled', '==', false))
      .valueChanges();
  }

  saveImageRef(filePath, file) {
    return {
      task: this.storage.upload(filePath, file),
      ref: this.storage.ref(filePath)
    };
  }
}
