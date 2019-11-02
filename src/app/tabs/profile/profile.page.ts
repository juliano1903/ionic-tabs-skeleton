import { Component, OnInit } from '@angular/core';
import { User, AuthProvider } from 'src/app/core/services/auth.types';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';

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
  profileForm: FormGroup;
  url: any;
  newImage: Image = {
    id: this.afs.createId(),
    image: ''
  };

  loading = false;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {}

  private createForm(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required, Validators.required]],
      address: [this.user.address, [Validators.required, Validators.required]],
      city: [this.user.city, [Validators.required, Validators.required]],
      state: [this.user.state, [Validators.required, Validators.required]],
      reg: [this.user.reg, [Validators.required, Validators.required]],
      password: [this.user.password, [Validators.required, Validators.required]]
    });
  }

  ionViewDidEnter(): void {
    this.user$ = this.usersService.getLoggedUser();
    this.user$.subscribe(user => {
      this.user = user;
      this.user.id = this.authService.currentUserId();
      this.createForm();
    });
  }

  async onSubmit(): Promise<void> {
    this.user = {
      ...this.user,
      phone: this.profileForm.value.phone,
      address: this.profileForm.value.address,
      city: this.profileForm.value.city,
      state: this.profileForm.value.state
    };

    console.log(this.user);
    this.usersService.update(this.user);

    if (this.profileForm.value.password) {
      this.authService.updateUserPassword(this.profileForm.value.password);
    }
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

  logout() {
    this.authService.logout();
    this.navCtrl.navigateForward('/login');
  }
}
