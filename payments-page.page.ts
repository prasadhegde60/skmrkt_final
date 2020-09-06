import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-payments-page',
  templateUrl: './payments-page.page.html',
  styleUrls: ['./payments-page.page.scss'],
})
export class PaymentsPagePage implements OnInit {
  emailId: String = null;
  role: String = null;
  roleIndex: String = null;
  localId: String = null;
  expiresIn: String = null;
  token: String = null;
  isPremium: boolean = false;
  isAdmin: boolean = false;
  isStandard: boolean = false;
  isLoading: boolean = false;
  finalAmount: number = 599;

  addScript: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private iab: InAppBrowser,
    private payPal: PayPal) { } 

  ngOnInit() {
    this.authService.emailId.subscribe(emailId => {
      if(emailId){
        this.emailId = emailId;
      }
    })
    this.authService.roleIndex.subscribe(roleIndex => {
      if(roleIndex){
        this.roleIndex = roleIndex;
      }
    })
    this.authService.expiresIn.subscribe(expiresIn => {
      if(expiresIn){
        this.expiresIn = (expiresIn/1000).toString();
      }
    })
    this.authService.userToken.subscribe(token => {
      if(token){
        this.token = token;
      }
    })
    this.authService.localId.subscribe(localId => {
      if(localId){
        this.localId = localId;
      }
    })
    this.authService.userRole.subscribe(userRole => {
      if (userRole){
        this.role = userRole;
        console.log("User Role:", userRole)
        if(userRole === "Admin" || userRole === "Premium"){
          this.router.navigateByUrl("/user-page");
        }
      }
    });

  }

  paypalConfig = {
    env: 'sandBox',
    client: {
      sanBox: '1234566',
      production: ''
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {amount: {total: this.finalAmount, currency: 'INR'}}
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        //do something after paymet is successful
      })
    }
  };

  /*
  ngAfterViewChecked(): void {
    if(!this.addScript){
      this.addPaypalScript().then(() => {
        //paypal.buttons.render(this.paypalConfig, 'paypal-button-container');
      })
    }
  }*/

  addPaypalScript(){
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  onMakePayment(){
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'ED5ZIn87zGe7GAP1UtjRt5sq1tZj7Qi1bx9Imejw14p4pVu7aX_CEzOShx1cyQmWQ9ziScPMiWRE21B4'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          // Successfully paid
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
    //this.postPaymentActions(true);
  }


  postPaymentActions(paymentResult: Boolean = false){
    if(paymentResult){
      //update the role in database
      this.isLoading = true;
      const message = "Making payment ..";
      this.loadingCtrl
      .create({keyboardClose: true, message: message})
      .then(loadingEl => {
        loadingEl.present();
        const role = "Premium";
        this.authService.updateUserRoleProfile(this.emailId, role, this.roleIndex).subscribe(
          resData => {
            this.authService.setUserData(this.localId, this.emailId, this.token, this.expiresIn, role, this.roleIndex);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/user-page');
            const header = "Payment Successful !"
            const message = " Congratulations !! You are a Premium Member now"
            this.showAlert(header, message)
          },
          errRes => {
            loadingEl.dismiss();
            console.log(errRes);
            console.log(errRes.error.error.message)
            const code = errRes.error.error.message;
            let header = 'Payment Failed'
            let message = 'Unable to process payment';
            this.showAlert(header, message);
          }
        );
      });

    }else{
      const header = "Payment Unsuccessful !"
      const message = "Please try again after some time. If any amount is debited from you account, it will be credited within 48 hours"
      this.router.navigateByUrl('/user-page');
      this.showAlert(header, message);
    }
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
