import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricDataPage } from './historic-data.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricDataPageRoutingModule {}
