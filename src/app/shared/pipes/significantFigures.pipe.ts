import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sigFig' })
export class SignificantFiguresPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  public transform(value: number, precision: number): number {
    return parseFloat(value.toPrecision(precision));
  }
}
