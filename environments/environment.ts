// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseAPIKey: 'AIzaSyAnkundpZfts5uEBVQNJa6w-hMXcAwjPT0',
  cloudFunctions : {
    createOrder: 'https://us-central1-stock-market-9e74c.cloudfunctions.net/createOrder',
    capturePayment: 'https://us-central1-stock-market-9e74c.cloudfunctions.net/capturePayments'
  },
  RAZORPAY_KEY_ID: 'rzp_test_5ur9TowArpAkil',
  KEY_SECRET: 'qLkjoJkSN84iTzAFcG4w4dfE'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
