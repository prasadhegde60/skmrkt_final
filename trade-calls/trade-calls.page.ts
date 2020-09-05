import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { StockFormat } from 'src/app/stock-format.model';
import { Subscription } from 'rxjs';
import { StockDataService } from 'src/app/stock-data.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Plugins, NetworkStatus } from '@capacitor/core';
import { NetworkServiceProviderService } from 'src/app/network-service-provider.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-trade-calls',
  templateUrl: './trade-calls.page.html',
  styleUrls: ['./trade-calls.page.scss'],
})
export class TradeCallsPage implements OnInit {
  displayedColumns: string[] = ['symbol', 'trigger', 'stopLoss', 'target', 'action'];
  dataSource: MatTableDataSource<StockFormat>;
  isLoading = false;
  todaysData: StockFormat[];
  private todaysDataSub : Subscription;
  paginator: MatPaginator;
  isConnected: boolean = false;
  isOrdinaryUser: boolean = true;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
    }


  constructor(
    private stockDataService: StockDataService,
    private router: Router, 
    private netService: NetworkServiceProviderService,
    private authService: AuthService,
  ) { }

  setDataSourceAttributes() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit() {
    this.dataSource =   new MatTableDataSource();
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.todaysDataSub = this.stockDataService.todaysData.subscribe(data =>{
        this.todaysData = data
        this.dataSource.data = data;
      })
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.authService.userRole.subscribe(userRole => {
        console.log(" HEre goes userRole", userRole);
        if (userRole != null && userRole != 'Standard'){
          this.isOrdinaryUser = false;
        }
      });
    }
    else{
      this.isConnected = false;
    }
  }

  ngAfterViewInit() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }    

  onNavigateHome(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.router.navigateByUrl('/home');
    }
    else{
      this.isConnected = false;
      this.router.navigateByUrl('trade-calls');
    }
  }

  
  ionViewWillEnter(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.isLoading = true;
      this.stockDataService.fetchTodaysData.subscribe(
        res => {
          
          this.isLoading = false;
        });
      this.authService.userRole.subscribe(userRole => {
        if (userRole != null && userRole != 'Standard'){
          this.isOrdinaryUser = false;
        }
      });
    }
    else{
      this.isConnected = false;
    }
  }

  ngOnDestroy() {
    if (this.todaysDataSub) {
      this.todaysDataSub.unsubscribe();
    }
  }


}
