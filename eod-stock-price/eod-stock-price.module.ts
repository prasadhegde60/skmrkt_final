import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EodStockPricePageRoutingModule } from './eod-stock-price-routing.module';

import { EodStockPricePage } from './eod-stock-price.page';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EodStockPricePageRoutingModule,
    MaterialModule
  ],
  declarations: [EodStockPricePage]
})
export class EodStockPricePageModule {}
