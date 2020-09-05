import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform, AlertController } from '@ionic/angular';

import { Plugins, NetworkStatus } from '@capacitor/core';

const { Network } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class NetworkServiceProviderService {
  private status: BehaviorSubject<NetworkStatus> = new BehaviorSubject<NetworkStatus>({connected: false, connectionType:'none'});

  constructor(private toastController: ToastController, private plt: Platform) {
    this.plt.ready().then(() => {
      console.log("Inside the constructor of network service");
      this.updateNetworStatusChange();
      this.pollStatus();
      
    });
  }
  
  public async pollStatus(){
    let status = await Network.getStatus();
    console.log("get the status of ntwrk");
    console.log(status);
    this.status.next(status);
  }

  public updateNetworStatusChange(){
    console.log("Inside on Network Change Status service ");
    Network.addListener('networkStatusChange', (status) => {
      console.log("status is", status);
      this.status.next(status);
    });
  }

  public onNetworkChange(): Observable<NetworkStatus>{
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus() {
    return this.status.getValue();
  }x
}
