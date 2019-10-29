import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/services/auth.types';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/services/auth.service';

export interface Image {
  id: string;
  image: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  user$: Observable<User>;
  user: User;

  url: any;
  newImage: Image = {
    id: this.afs.createId(),
    image: ''
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private afs: AngularFirestore
  ) {}

  ionViewDidEnter(): void {
    this.user$ = this.usersService.getLoggedUser();
    this.user$.subscribe(user => {
      this.user = user;
      this.user.id = this.authService.currentUserId();
    });
  }
  uploadImage(event) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      // For Preview Of Image
      reader.onload = (e: any) => {
        // called once readAsDataURL is completed
        this.url = e.target.result;
        console.log('url', this.url);

        // For Uploading Image To Firebase
        const fileraw = event.target.files[0];
        console.log(fileraw);
        const filePath =
          '/Image/' +
          this.newImage.id +
          '/' +
          'Image' +
          (Math.floor(1000 + Math.random() * 9000) + 1);
        const result = this.usersService.saveImageRef(filePath, fileraw);
        console.log('result', result);
        const ref = result.ref;
        result.task.then(a => {
          ref.getDownloadURL().subscribe(image => {
            console.log('image', image);
            this.newImage.image = image;
            this.user.picture = this.newImage.image;
            console.log('res', this.user);
            this.usersService.update(this.user);
            this.loading = false;
          });
        });
      };
    }
  }
}
