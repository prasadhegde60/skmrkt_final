import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FailurePagePage } from './failure-page.page';

const routes: Routes = [
  {
    path: '',
    component: FailurePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FailurePagePageRoutingModule {}
