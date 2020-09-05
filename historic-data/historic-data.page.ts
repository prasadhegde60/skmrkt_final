import { Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { StockDataService } from 'src/app/stock-data.service';
import { StockFormat } from 'src/app/stock-format.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NetworkServiceProviderService } from 'src/app/network-service-provider.service';

@Component({
  selector: 'app-historic-data',
  templateUrl: './historic-data.page.html',
  styleUrls: ['./historic-data.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoricDataPage implements OnInit {
  displayedColumns: string[] = ['date', 'symbol', 'action', 'trigger', 'stopLoss', 'target'];
  dataSource: MatTableDataSource<StockFormat>;
  isLoading = false;
  historicData: StockFormat[];
  private historicDataSub : Subscription;
  paginator: MatPaginator;
  isConnected: boolean = false;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
    }

  constructor(
    private stockDataService: StockDataService, 
    private netService: NetworkServiceProviderService
  ) { }

  setDataSourceAttributes() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.dataSource =   new MatTableDataSource();
      this.historicDataSub = this.stockDataService.stockData.subscribe(data =>{
        const todaysDate = new Date();
        this.historicData = data.filter(data => data.date.setHours(0,0,0,0) != todaysDate.setHours(0,0,0,0));
        this.dataSource.data = this.historicData;
      })
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else{
      this.isConnected = false;
    }
  }

  
  ionViewWillEnter(){
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.isLoading = true;
      this.stockDataService.fetchData().subscribe(() => {
        this.isLoading = false;
      });    
    }
    else{
      this.isConnected = false;
    }      
  }

  ngOnDestroy() {
    if (this.historicDataSub) {
      this.historicDataSub.unsubscribe();
    }
  }

}
