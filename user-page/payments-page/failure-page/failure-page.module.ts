import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FailurePagePageRoutingModule } from './failure-page-routing.module';

import { FailurePagePage } from './failure-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FailurePagePageRoutingModule
  ],
  declarations: [FailurePagePage]
})
export class FailurePagePageModule {}
