import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    MatDialogModule
  ],
  declarations: [AuthPage, ResetPasswordComponent, TermsAndConditionComponent],
  entryComponents: [ResetPasswordComponent, TermsAndConditionComponent]
})
export class AuthPageModule {}
