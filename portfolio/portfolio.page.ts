import { Component, OnInit } from '@angular/core';
import { StockDataService } from 'src/app/stock-data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NetworkServiceProviderService } from 'src/app/network-service-provider.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  currentPortfolioValue: Number;
  currentPortfolioSign: String;
  portfolioValue: number;
  private portfolioValueSub : Subscription;
  isLoading: boolean = false;
  isConnected: boolean = false;

  constructor(
    private stockDataService: StockDataService,
    private router: Router, 
    private netService: NetworkServiceProviderService
  ) { }

  ngOnInit() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.portfolioValueSub = this.stockDataService.portfolioValue.subscribe(data =>{
        this.portfolioValue = data
        this.checkPorfolioSign();
      })
    }
    else{
      this.isConnected = false;
    }
    
  }

  onNavigateHome(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.router.navigateByUrl('/home');
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('/portfolio-home');
    }
  }

  ionViewWillEnter(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.isLoading = true;
      this.stockDataService.getCurrentPortfolioValue().subscribe(() => {
        this.isLoading = false;
        this.checkPorfolioSign();
      });  
    }
    else{
      this.isConnected = false;
    }
  }

  checkPorfolioSign(){
    this.currentPortfolioSign = (Number(this.portfolioValue) > 0) ? 'success' : 'danger' ;
  }

  ngOnDestroy() {
    if (this.portfolioValueSub) {
      this.portfolioValueSub.unsubscribe();
    }
  }

}
