import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    public dialog: MatDialog,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private loadingCtrl: LoadingController) {}

  ngOnInit() {}


  onResetClick(): void {
    const regex = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/
    if(this.email){
      const val = regex.test(String(this.email).toLowerCase());
      if(val){
        this.isLoading = true;
        const message1 = "Please wait .."
        this.loadingCtrl
        .create({keyboardClose: true, message: message1})
        .then(loadingEl => {
          loadingEl.present();
          this.authService.resetPassword(this.email).subscribe(
            ressData => {
              this.isLoading = false;
              loadingEl.dismiss();
              const message = `Steps to reset password is sent to ${this.email}`;
              const header = "Check Your Email !";
              this.showAlert(header, message);
            },
            errrRes =>{
              loadingEl.dismiss();
              const code = errrRes.error.error.message;
              let message = 'Failed to Reset Your Password';
              if (code ==='EMAIL_NOT_FOUND'){
                message = 'Email ID is not found !';
              }
              let header = 'Attention !';
              this.showAlert(header, message);
            }
          );
        });




    
      }
      else{
        const header = "Invalid Email";
        const message = "Entered email is Invalid";
        this.showAlert(header, message);
      }
    }
    else{
      const header = "Oops ..!";
      const message = "Email address must be entered";
      this.showAlert(header, message);
    }
    this.dialogRef.close();
    
  }

  onCancelClick(): void{
    this.dialogRef.close();
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
}
