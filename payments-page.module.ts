import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsPagePageRoutingModule } from './payments-page-routing.module';

import { PaymentsPagePage } from './payments-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsPagePageRoutingModule
  ],
  declarations: [PaymentsPagePage]
})
export class PaymentsPagePageModule {}
