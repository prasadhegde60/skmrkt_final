import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeCallsPageRoutingModule } from './trade-calls-routing.module';

import { TradeCallsPage } from './trade-calls.page';
import { MaterialModule } from 'src/app/material.module';
import { ResetPasswordComponent } from 'src/app/auth/reset-password/reset-password.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradeCallsPageRoutingModule,
    MaterialModule
  ],
  declarations: [TradeCallsPage]
})
export class TradeCallsPageModule {}
