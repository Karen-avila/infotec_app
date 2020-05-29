import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanSocialPageRoutingModule } from './plan-social-routing.module';

import { PlanSocialPage } from './plan-social.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanSocialPageRoutingModule
  ],
  declarations: [PlanSocialPage]
})
export class PlanSocialPageModule {}
