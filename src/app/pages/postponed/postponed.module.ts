import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostponedPageRoutingModule } from './postponed-routing.module';

import { PostponedPage } from './postponed.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostponedPageRoutingModule, 
    TranslateModule
  ],
  declarations: [PostponedPage]
})
export class PostponedPageModule {}
