import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EodStockPricePage } from './eod-stock-price.page';

const routes: Routes = [
  {
    path: '',
    component: EodStockPricePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EodStockPricePageRoutingModule {}
