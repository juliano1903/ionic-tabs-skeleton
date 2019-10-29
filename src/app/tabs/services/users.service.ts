import { Injectable } from '@angular/core';
import { User } from 'src/app/core/services/auth.types';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { AuthService } from 'src/app/core/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends Firestore<User> {
  constructor(
    private authService: AuthService,
    db: AngularFirestore,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    super(db);
    this.setCollection('/users');
  }

  getLoggedUser(): Observable<User> {
    return this.get(this.authService.currentUserId());
  }

  saveImageRef(filePath, file) {
    return {
      task: this.storage.upload(filePath, file),
      ref: this.storage.ref(filePath)
    };
  }
}
