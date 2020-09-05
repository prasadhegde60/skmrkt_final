import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { StockDataService } from '../stock-data.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Plugins, AppState } from '@capacitor/core';
import { take } from 'rxjs/operators';
import { NetworkServiceProviderService } from '../network-service-provider.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {
  private authSub: Subscription;
  private previousAuthState = false;
  isLoading = false;
  isConnected: boolean = false;
  
  constructor(
    private authService: AuthService,
    private stockDataService: StockDataService,
    private router: Router,
    private location: Location,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, 
    private netService: NetworkServiceProviderService
  ) { }

  ngOnInit() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/home');
        }
        this.previousAuthState = isAuth;
      });
      Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
    }
    else{
      this.isConnected = false;
    }
  }

  onHome(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.router.navigateByUrl('/home');
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('/admin-page');
    }
  }

  onLogout(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.authService.logout();
      this.location.replaceState('/');
      this.router.navigateByUrl('/home');
    }
    else
    {
      this.isConnected = false;
      this.router.navigateByUrl('admin-page');
    }
  }

  addStockCall(symbol: String, action: String, triggerPrice: number, stopLoss: number, targetPrice:number){ 
    this.isLoading = true;
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Submitting Data ..'})
    .then( loadingEl => {
      loadingEl.present();
      this.stockDataService.addStock(symbol, action, triggerPrice, stopLoss, targetPrice).subscribe(
        resData => {
          this.isLoading = false;
          loadingEl.dismiss();
        },
        errRes => {
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message = 'Error Occured while submitting data';
          this.showAlert(message);
        }
      )
    })
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  onReset(form: NgForm){
    form.reset();
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const symbol = form.value.symbol;
    const action = form.value.action;
    const triggeerPrice = form.value.triggerPrice;
    const stopLoss = form.value.stopLoss;
    const targetPrice = form.value.targetPrice;
    this.addStockCall(symbol, action, triggeerPrice, stopLoss, targetPrice);
    form.reset();
    
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
  }

  private checkAuthOnResume(state: AppState) {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      if (state.isActive) {
        this.authService
          .autoLogin()
          .pipe(take(1))
          .subscribe(success => {
            if (!success) {
              this.onLogout();
            }
          });
      }
    }
    else{
      this.isConnected = false;
    }
  }

  onEodPage(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.router.navigateByUrl('/admin-page/eod-stock-price');
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('/admin-page');
    }
  }

  ngOnDestroy(){
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

}
