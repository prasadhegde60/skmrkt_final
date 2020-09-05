import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatDialog } from '@angular/material';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  private isUnderstood: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private dialog: MatDialog
  ) { }

  ngOnInit() {}
  
  public setIsUnderstood(flag: boolean){
    this.isUnderstood = flag;
  }

  authenticate(email: String, password: String){
    this.isLoading = true;
    const message = this.isLogin ? 'Logging you in..' : 'Signing you up ..'
    this.loadingCtrl
    .create({keyboardClose: true, message: message})
    .then( loadingEl => {
      if (this.isLogin) {
        loadingEl.present();
        this.authService.login(email, password).subscribe(
          resData => {
            this.authService.getUserRoleProfile(resData.localId, resData.email, resData.idToken, resData.expiresIn).subscribe(
              ressData => {
                this.isLoading = false;
                loadingEl.dismiss();
                this.router.navigateByUrl('/home');
              },
              errrRes =>{
                loadingEl.dismiss();
                const code = errrRes.error.error.message;
                let header = 'Authentication failed';
                let message = 'Failed to retrieve User Profile';
                this.showAlert(header, message);
              }
            );
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let header = 'Authentication failed';
            let message = 'Email Id or Password is Incorrect';
            if (code ==='INVALID_EMAIL'){
              message = 'Email ID is not found !';
            }
            else if(code === 'INVALID_PASSWORD'){
              message = 'Password Incorrect !';
            }
            else{
              message = message;
            }
            this.showAlert(header, message);
  
          }
        );
      } else {
        this.launchTermsAndConditions().subscribe(result =>{
          if(result){
            loadingEl.present();
            this.authService.signup(email, password).subscribe(
              resData => {
                const userRole: String = "Standard";
                console.log("INside singup of auth service")
                console.log(resData);
                this.authService.setUserRoleProfile(resData.localId, resData.email, resData.idToken, resData.expiresIn, userRole).subscribe(
                  ressData => {
                    this.isLoading = false;
                    loadingEl.dismiss();
                    this.router.navigateByUrl('/home');
                  },
                  errrRes =>{
                    loadingEl.dismiss();
                    const code = errrRes.error.error.message;
                    let header = 'Authentication failed';
                    let message = 'Failed to retrieve User Profile';
                    this.showAlert(header, message);
                  }
                );
              },
              errRes => {
                loadingEl.dismiss();
                console.log(errRes);
                console.log(errRes.error.error.message)
                const code = errRes.error.error.message;
                let header = 'Signup Failed'
                let message = 'Unable to Sign you up. Please try again later';
                if (code ==='EMAIL_EXISTS'){
                  message = 'Email already Registered !';
                }
                else{
                  message = message;
                }
                this.showAlert(header, message);
      
              }
            );
          }
        })
        
      }
    })
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm){
    console.log("After Submitting, i see control")
    if(!form.valid){
      return;
    }
    const emailId = form.value.emailId;
    const password = form.value.password;
    this.authenticate(emailId, password);
    form.reset();
  }

  private showAlert(header: string, message: string) {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  onForgotPassword(){
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '400px',
    });

  }

  launchTermsAndConditions(){
    const dialogRef = this.dialog.open(TermsAndConditionComponent, {
      width: '400px', disableClose: false});

    return dialogRef.afterClosed();
  }
    
  onTermsAndCondition(){
    const dialogRef = this.dialog.open(TermsAndConditionComponent, {
       disableClose: false});
  }

}
