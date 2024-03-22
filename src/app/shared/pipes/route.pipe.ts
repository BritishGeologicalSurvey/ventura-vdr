import { Pipe, PipeTransform } from '@angular/core';
import { AppRoute, getRoute } from 'src/app/routes/routes';

@Pipe({ name: 'route' })
export class RoutePipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  public transform(route: AppRoute, subsValues?: Array<string>): Array<string> {
    return getRoute(route, subsValues);
  }
}
