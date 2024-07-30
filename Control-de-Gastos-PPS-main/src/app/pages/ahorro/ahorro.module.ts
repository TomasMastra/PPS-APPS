import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AhorroPageRoutingModule } from './ahorro-routing.module';

import { AhorroPage } from './ahorro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AhorroPageRoutingModule
  ],
  declarations: [AhorroPage]
})
export class AhorroPageModule {}
