import { Component } from '@angular/core';
import { User } from 'src/app/core/services/auth.types';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Chooser, ChooserResult } from '@ionic-native/chooser/ngx'
import * as moment from 'moment';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

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

  fileObj: ChooserResult;

  loading = false;

  documentName: string;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private chooser: Chooser,
    private overlayService: OverlayService,
    private router: Router
  ) {}

  async ngOnInit() {
    const loading = await this.overlayService.loading();

    this.user$ = this.usersService.getLoggedUser();
    this.user$.subscribe(user => {
      this.user = user;
      this.user.id = this.authService.currentUserId();
      this.createForm();
      this.formControlValueChanged();
      loading.dismiss();
    });
  }

  formControlValueChanged() {
    this.profileForm.get('password').valueChanges.pipe(distinctUntilChanged()).subscribe(
        (mode: string) => {
          console.log(mode);
            if(mode.length > 0) {
              this.profileForm.get('password').setValidators([Validators.required, Validators.minLength(6)]);
            } else {
              this.profileForm.get('password').clearValidators();
            }
            this.profileForm.get('password').updateValueAndValidity();
        });
  }

  ionViewWillEnter(): void {
    this.authService.isAuthenticated.subscribe(
      logged => this.redirect(logged))
  }

  private redirect(logged: boolean) {
    const urlRedirect = "tabs"
    if (!logged) {
      this.overlayService.toast({
        message: "You aren't logged. Please relogin."
      });
      this.router.navigate(['/login'], {
        queryParams: { urlRedirect }
      });
    }
  }

  private createForm(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required]],
      address: [this.user.address, [Validators.required]],
      city: [this.user.city, [Validators.required]],
      state: [this.user.state, [Validators.required]],
      reg: [this.user.reg, [Validators.required]],
      password: [this.user.password]
    });
  }

  PickFile() {
    this.chooser.getFile('application/pdf').then((value: ChooserResult) => {
      this.fileObj = value;
    },(err) => {
    })
  }

  async ionViewDidEnter(): Promise<void> {

  }

  async onSubmit(): Promise<void> {
    this.user = {
      ...this.user,
      phone: this.profileForm.value.phone,
      address: this.profileForm.value.address,
      city: this.profileForm.value.city,
      state: this.profileForm.value.state
    };

    let updatedMessage = "User data was successfully updated";
    
    try {

      this.usersService.update(this.user);
  
      if (this.profileForm.value.password) {
        this.authService.updateUserPassword(this.profileForm.value.password);
      }
    } catch (error) {
      updatedMessage = "An error occurred while updating user data";
    } finally {
        this.overlayService.toast({
          message: updatedMessage
        });
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

        // For Uploading Image To Firebase
        const fileraw = event.target.files[0];
        const filePath =
          '/Image/' +
          this.newImage.id +
          '/' +
          'Image' +
          (Math.floor(1000 + Math.random() * 9000) + 1);
        const result = this.usersService.saveImageRef(filePath, fileraw);
        const ref = result.ref;
        result.task.then(a => {
          ref.getDownloadURL().subscribe(image => {
            this.newImage.image = image;
            this.user.picture = this.newImage.image;
            this.usersService.update(this.user);
            this.loading = false;
          });
        });
      };
    }
  }

  async uploadFile(event, filename) {

    const loading = await this.overlayService.loading();

    try {
      if (filename) {
        this.user.papUpdatedDate = moment().format('YYYY-MM-DDTHH:mm');
        this.user.papStatus = 'pending';
        this.usersService.update(this.user)
      }
  
      if (this.documentName != undefined) {
        filename = this.documentName;
      }
  
      if (this.documentName == undefined && filename == undefined) {
        return;
      }
  
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
  
        reader.readAsDataURL(event.target.files[0]);
  
        reader.onload = (e: any) => {
  
          const fileraw = event.target.files[0];
          const filePath =
            '/Documents/' +
            this.user.id +
            '/' +
            filename;
          this.usersService.saveImageRef(filePath, fileraw);
        };
      }

      this.overlayService.toast({
        message: "Polizza Assicurativa Professionale was successfully updated"
      })
      this.documentName = null;
      
    } catch (error) {
      this.overlayService.toast({
        message: "An error occurred while updating the document"
      })
    } finally {
      loading.dismiss();
    }
  }

  get password(): FormControl {
    return <FormControl>this.profileForm.get('password');
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login", { skipLocationChange: false });
  }
}
