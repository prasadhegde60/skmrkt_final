import { Component, OnInit, ViewChild} from '@angular/core';
import { StockDataService } from 'src/app/stock-data.service';
import { StockFormat } from 'src/app/stock-format.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { User } from 'src/app/auth/user.model';
import { NetworkServiceProviderService } from 'src/app/network-service-provider.service';

@Component({
  selector: 'app-eod-stock-price',
  templateUrl: './eod-stock-price.page.html',
  styleUrls: ['./eod-stock-price.page.scss'],
})
export class EodStockPricePage implements OnInit {

  displayedColumns: string[] = ['date', 'symbol', 'trigger','action', 'eodPrice'];
  dataSource: MatTableDataSource<StockFormat>;
  isLoading = false;
  historicData: StockFormat[];
  private historicDataSub : Subscription;
  paginator: MatPaginator;
  isDisabled: boolean = true;
  isConnected: boolean = false;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
    }

  constructor(
    private stockDataService: StockDataService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private netService: NetworkServiceProviderService
  ) { }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    if (this.netService.getCurrentNetworkStatus().connected){
      this.isConnected = true;
      this.dataSource =   new MatTableDataSource();
      this.historicDataSub = this.stockDataService.stockData.subscribe(data =>{
        this.historicData = data
        this.dataSource.data = data;
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
  
  onSubmit(form: NgForm){
    const myData = this.dataSource.data.map((row: StockFormat) => {
      if(row.eodPrice == null){
        row.eodPrice = null
      }
      const eodPriceUpdated = (row.eodPrice > 0) ? "yes" : null
      return {id: row.id, action: row.action, date: row.date, stopLoss: row.stopLoss, symbol: row.symbol, target: row.target, trigger: row.trigger, eodPrice: row.eodPrice, eodPriceUpdated: eodPriceUpdated }
    });

    this.updateStockCall(myData);
    this.isDisabled = true;
  }

  updateStockCall(myData: StockFormat[]){ 
    this.isLoading = true;
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Submitting Data ..'})
    .then( loadingEl => {
      loadingEl.present();
      this.stockDataService.updateStock(myData).subscribe(
        resData => {
          this.stockDataService.calculatePortfolioValue().subscribe(
            resData1 => {
              this.isLoading = false;
              loadingEl.dismiss();
            }
          );
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

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
    this.isDisabled = false;
  }

  notEmptyValidation(event: any) {

  }


  ngOnDestroy() {
    if (this.historicDataSub) {
      this.historicDataSub.unsubscribe();
    }
  }

}
