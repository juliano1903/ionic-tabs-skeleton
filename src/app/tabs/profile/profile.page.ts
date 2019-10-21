import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/services/auth.types';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  user$: Observable<User>;

  constructor(private usersService: UsersService) {}

  ionViewDidEnter(): void {
    this.user$ = this.usersService.getLoggedUser();
    console.log(this.user$);
  }
}
