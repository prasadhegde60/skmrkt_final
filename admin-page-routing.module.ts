import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPagePage } from './admin-page.page';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminPagePage
  },
  {
    path: 'eod-stock-price',
    loadChildren: () => import('./eod-stock-price/eod-stock-price.module').then( m => m.EodStockPricePageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data : { roles: ["Admin"]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPagePageRoutingModule {}
