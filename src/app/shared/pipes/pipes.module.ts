import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RoutePipe } from './route.pipe';
import { SignificantFiguresPipe } from './significantFigures.pipe';

@NgModule({
  declarations: [RoutePipe, SignificantFiguresPipe],
  imports: [CommonModule],
  exports: [RoutePipe, SignificantFiguresPipe],
  providers: [],
})
export class PipesModule {}
