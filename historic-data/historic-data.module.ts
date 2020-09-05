import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricDataPageRoutingModule } from './historic-data-routing.module';

import { HistoricDataPage } from './historic-data.page';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricDataPageRoutingModule,
    MaterialModule
  ],
  declarations: [HistoricDataPage]
})
export class HistoricDataPageModule {}
