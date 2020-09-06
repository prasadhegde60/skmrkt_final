import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsPagePage } from './payments-page.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsPagePage
  },
  {
    path: 'success-page',
    loadChildren: () => import('./success-page/success-page.module').then( m => m.SuccessPagePageModule)
  },
  {
    path: 'failure-page',
    loadChildren: () => import('./failure-page/failure-page.module').then( m => m.FailurePagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsPagePageRoutingModule {}
