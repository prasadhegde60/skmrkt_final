import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { switchMap, tap , map, take} from 'rxjs/operators';
import { StockFormat } from './stock-format.model';
import { BehaviorSubject } from 'rxjs';
import { NetworkServiceProviderService} from './network-service-provider.service';

interface StockData{
  id: String;
  action: string;
  date: Date;
  stopLoss: number;
  symbol: string;
  target: number;
  trigger: number;
  eodPrice: number;
  eodPriceUpdated: String;
}

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  private _stockData = new BehaviorSubject<StockFormat[]>([]);
  private _todaysData = new BehaviorSubject<StockFormat[]>([]);
  private _portfolioValue = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private netService: NetworkServiceProviderService
  ) { }

  addStock(symbol: String, action: String, triggerPrice: number, stopLoss: number, targetPrice:number){
    return this.authService.userToken.pipe(
      take(1),
      switchMap(token => {
      return this.http.post(
        `https://stock-market-9e74c.firebaseio.com/stock-calls.json?auth=${token}`,
        { symbol: symbol, action: action, stopLoss: stopLoss,  target: targetPrice, trigger: triggerPrice, date: new Date(), eodPrice: 0, eodPriceUpdated: null }
        );
      }
    ));    
  }
    

  updateStock(myData: StockFormat[]){
    const requestBody:any = this.normalizeArray(myData, 'id'); 
    return this.authService.userToken.pipe(
      take(1),
      switchMap(token => {
      return this.http.patch(
        `https://stock-market-9e74c.firebaseio.com/stock-calls.json?auth=${token}`, requestBody 
        );
      }
    ));    
  }

  normalizeArray<T>(array: Array<T>, indexKey: keyof T) {
    const normalizedObject: any = {}
    for (let i = 0; i < array.length; i++) {
         const key = array[i][indexKey]
         normalizedObject[key] = array[i]
         delete normalizedObject[key]['id']
    }
    return normalizedObject as { [key: string]: T }
  }
  
  get stockData(){
    return this._stockData.asObservable();
  }

  get todaysData(){
    return this._todaysData.asObservable();
  }

  get portfolioValue(){
    return this._portfolioValue.asObservable();
  }

  get fetchTodaysData(){
    return this.http.get<{[key: string]: StockData}>(`https://stock-market-9e74c.firebaseio.com/stock-calls.json`
    ).pipe( map( resData => {
        const stockData = [];
        for( const key in resData){
          if(resData.hasOwnProperty(key)){
            stockData.push(
              new StockFormat(
                key,
                resData[key].action, 
                new Date(resData[key].date),
                resData[key].stopLoss,
                resData[key].symbol,
                resData[key].target,
                resData[key].trigger,
                resData[key].eodPrice,
                resData[key].eodPriceUpdated
              )
            );
          }
        }
        console.log(stockData);
        return stockData; 
      }),
      tap(stockData => {
        const todaysDate = new Date();
        this._todaysData.next(stockData.filter(data => data.date.setHours(0,0,0,0) === todaysDate.setHours(0,0,0,0)));
        console.log(this._todaysData);
      })
    )
  }

  fetchData(){  
    return this.http.get<{[key: string]: StockData}>(`https://stock-market-9e74c.firebaseio.com/stock-calls.json`
    ).pipe( map( resData => {
        const stockData = [];
        for( const key in resData){
          if(resData.hasOwnProperty(key)){
            stockData.push(
              new StockFormat(
                key,
                resData[key].action, 
                new Date(resData[key].date),
                resData[key].stopLoss,
                resData[key].symbol,
                resData[key].target,
                resData[key].trigger,
                resData[key].eodPrice,
                resData[key].eodPriceUpdated
              )
            );
          }
        }
        return stockData; 
      }),
      tap(stockData => {
        this._stockData.next(stockData);
      })
    );
  }

  getCurrentPortfolioValue(){
    return this.http.get<number>(`https://stock-market-9e74c.firebaseio.com/portfolio-value.json`
    ).pipe( map( resData => {
        return resData["value"].toFixed(2);
      }),
      tap(val => {
        this._portfolioValue.next(val);
      })
    );
  }

  calculatePortfolioValue(){
    let porfValue = 0
    this._stockData.getValue().map(data =>{
      if(data.eodPrice != null && data.eodPrice != 0){
        const pnL = (data.action == 'buy') ? data.eodPrice - data.trigger : data.trigger - data.eodPrice;
        porfValue = porfValue + pnL*100/data.trigger
      }    
    });
    return this.authService.userToken.pipe(
      take(1),
      switchMap(token => {
      return this.http.patch(
        `https://stock-market-9e74c.firebaseio.com/portfolio-value.json?auth=${token}`, 
        { value: porfValue} 
        );
      }
    ));
  }
}
