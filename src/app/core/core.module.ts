import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, AppRoutingModule, PipesModule, MaterialModule],
  exports: [HeaderComponent],
  providers: [],
})
export class CoreModule {}
