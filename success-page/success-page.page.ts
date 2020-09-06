import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PaymentService } from '../payment.service';
import { ObjectUnsubscribedError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.page.html',
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {

  totalPrice = 0;
  quantity = 0;
  payableAmount = 0;
  WindowRef: any;
  processingPayment: boolean;
  paymentResponse:any = {};

  constructor(
    private paymentService: PaymentService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  proceedToPay(){
    console.log("INside payent")

    let receiptNumber = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
    
    let orderDetails = {
      amount: "2",
      receipt: receiptNumber
    }

    this.paymentService.createOrder(orderDetails)
        .subscribe(order => {
        console.log("TCL: CheckoutComponent -> initiatePaymentModal -> order", order)
          var rzp1 = new this.WindowRef.Razorpay(this.preparePaymentDetails(order));
          this.processingPayment = false;
          rzp1.open(); 
          event.preventDefault();
        }, error => {
        console.log("TCL: CheckoutComponent -> initiatePaymentModal -> error", error)

        })


  }


  preparePaymentDetails(order){

    var ref = this;
    return  {
      "key": environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      "amount": this.payableAmount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
      "name": 'Pay',
      "currency": order.currency,
      "order_id": order.id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
      "image": 'https://angular.io/assets/images/logos/angular/angular.png',
      "handler": function (response){
        ref.handlePayment(response);
      },
      "prefill": {
          "name": `Angular Geeks`
      },
      "theme": {
          "color": "#2874f0"
      }
     };
   }

   handlePayment(response) {

    this.paymentService.capturePayment({
      amount: this.payableAmount,
      payment_id: response.razorpay_payment_id
    })
      .subscribe(res => {
        this.paymentResponse = res;
        this.changeRef.detectChanges();
       },
      error => {
        this.paymentResponse = error;
      });
  }

}








