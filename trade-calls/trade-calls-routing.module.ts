import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeCallsPage } from './trade-calls.page';

const routes: Routes = [
  {
    path: '',
    component: TradeCallsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeCallsPageRoutingModule {}
