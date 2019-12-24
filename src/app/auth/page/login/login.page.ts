import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from 'src/app/core/services/auth.service';
import { AuthProvider } from 'src/app/core/services/auth.types';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { UsersService } from 'src/app/tabs/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  authForm: FormGroup;
  authProviders = AuthProvider;
  configs = {
    isSignIn: true,
    action: 'Login',
    actionChange: 'Create account'
  };
  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  prompt: any;
  installButton: any;
  closeButton: any;
  installEvent: any;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private router: Router
  ) {  }

  ngOnInit(): void {

      // Detects if device is in standalone mode


      // Checks if should display install popup notification:
      if (this.isIos()) {
        if (!this.isInStandaloneMode()) {
          const promptIOS = document.querySelector('.promptIOS') as HTMLElement;
          promptIOS.style.display = 'block';
        }
      } else {
        
        const prompt = document.querySelector('.prompt') as HTMLElement;
        const installButton = prompt.querySelector('.prompt__install') as HTMLElement;
        //const closeButton = prompt.querySelector('.prompt__close') as HTMLElement;
        let installEvent: any;
    
        window.addEventListener('beforeinstallprompt', (event) => {
          event.preventDefault();
          
          // if no localStorage is set, first time visitor
          if (!this.getVisited()) {
            // show the prompt banner
        
            // store the event for later use
            installEvent = event;
          }
        });
            prompt.style.display = 'block';
    
        installButton.addEventListener('click', () => {
          // hide the prompt banner
          prompt.style.display = 'none';
        
          // trigger the prompt to show to the user
          installEvent.prompt();
        
          // check what choice the user made
          installEvent.userChoice.then((choice: { outcome: string; }) => {
            // if the user declined, we don't want to show the button again
            // set localStorage to true
            if (choice.outcome !== 'accepted') {
              //this.setVisited();
            }
        
            installEvent = null;
          });
        });
      }
    this.createForm();
  }

  isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }

  isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator['standalone']);
  }
  
  ionViewWillEnter(): void {
      this.authService.isAuthenticated.subscribe(
        logged => this.redirect(logged))
  }

  getVisited() {
    return localStorage.getItem('install-prompt');
  }
  
  setVisited() {
    localStorage.setItem('install-prompt', 'true');
  }

  private redirect(logged: boolean) {
    if (logged) {
      this.router.navigateByUrl("/tabs", { skipLocationChange: false });
    }
  }

  private createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get name(): FormControl {
    return <FormControl>this.authForm.get('name');
  }

  get email(): FormControl {
    return <FormControl>this.authForm.get('email');
  }

  get password(): FormControl {
    return <FormControl>this.authForm.get('password');
  }

  changeAuthAction(): void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Login' : 'Sign Up';
    this.configs.actionChange = isSignIn ? 'Create account' : 'Already have an account';
    !isSignIn
      ? this.authForm.addControl('name', this.nameControl)
      : this.authForm.removeControl('name');
  }

  async onSubmit(provider: AuthProvider): Promise<void> {
    const loading = await this.overlayService.loading();
    const isSignIn = this.configs.isSignIn;

    try {
      const credentials = await this.authService.authenticate({
        isSignIn,
        user: this.authForm.value,
        provider
      });

      if (!isSignIn) {
        this.authForm.value.id = this.authService.currentUserId();
        this.usersService.create(this.authForm.value);
      }

      this.navCtrl.navigateForward(this.route.snapshot.queryParamMap.get('redirect') || '/tabs');
    } catch (e) {
      await this.overlayService.toast({
        message: e.message
      });
    } finally {
      loading.dismiss();
    }
  }
}
