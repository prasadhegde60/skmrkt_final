import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { Location } from '@angular/common';
import { take, switchMap, tap, map } from 'rxjs/operators';
import { AppState } from '@capacitor/core';
import { NetworkServiceProviderService} from './network-service-provider.service';

import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private authSub: Subscription;
  isLoggedIn = false;
  isLoggedOut = true;
  isConnected: boolean = false;
  isAdmin = false;
  isStandard = false;
  userEmail = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private netService: NetworkServiceProviderService
  ) {
    this.initializeApp();
  }

  ngOnInit(){
    this.isConnected = true;
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth =>{
      if(isAuth){
        this.isLoggedIn = isAuth;
        this.isLoggedOut = false;
        this.authService.emailId.subscribe(emailId => {
          if(emailId){
            this.userEmail = emailId;
          }
        })
        this.authService.userRole.subscribe(userRole => {
          if (userRole != null){
            if(userRole == 'Admin'){
              this.isAdmin = true;
            }
            else if(userRole == 'Standard'){
              this.isStandard = true;
            }
          } 
        });
        
      }
      });
      if(!this.isLoggedIn){
        this.authService.autoLogin().subscribe(isAuth =>{
          if(isAuth){
            this.isLoggedIn = isAuth;
            this.isLoggedOut = false;
          }
        });
      } 
      Plugins.App.addListener(
        'appStateChange',
        this.checkAuthOnResume.bind(this)
      );
  }
  
  initializeApp() {
    this.platform.ready().then((readySource) => {
      if (Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
      });
  }

  onLogin(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.router.navigateByUrl('/auth');
      
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('/home');
    }      
  }

  onAdminPage(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.router.navigateByUrl('/admin-page');
      
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('/home');
    }      
  }

  onAboutUs(){
    this.router.navigateByUrl('/home/about-us');
  }

  onDisclaimer(){
    this.router.navigateByUrl('/home/about-us');
  }

  logout(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.authService.logout();
      this.location.replaceState('/');
      this.router.navigateByUrl('/home');
      this.isLoggedIn = false;
      this.isLoggedOut = true;
      this.isAdmin = false;
      this.isStandard = false;
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('/home');
    }
  }

  onUserPage(){
    console.log("INside onIserPage");
    this.router.navigateByUrl('/user-page');  
  }

  private checkAuthOnResume(state: AppState) {
    console.log("Inside checkAuthonResume");
    console.log(this.isLoggedIn);
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            this.logout();
          }
        });
    }
  }

  onUpgrade(){
    if(this.isStandard){
      this.router.navigateByUrl("/user-page/payments-page");
    }
  }
}
