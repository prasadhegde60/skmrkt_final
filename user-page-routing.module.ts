import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPagePage } from './user-page.page';

const routes: Routes = [
  {
    path: '',
    component: UserPagePage
  },
  {
    path: 'payments-page',
    loadChildren: () => import('./payments-page/payments-page.module').then( m => m.PaymentsPagePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPagePageRoutingModule {}
