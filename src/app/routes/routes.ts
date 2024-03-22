/*
 example route with variables

  public static readonly TEST = {
    ...BASE_ROUTE,
    subsKeys: ['id1', 'id2'],
    segments: 'test/:id1/:id2',
    parent: AppRoutes.TEST_PARENT,
    getRoute(id1: string, id2: string): Array<string> {
      return getRoute(this, [id1, id2]);
    },
  };

 get route in ts: AppRoutes.QUICK_MAPS_BASELINE.getRoute('11', '12')
 get route in template: <a [routerLink]="ROUTES.TEST | route: [13,14]">TEST</a>
 */

/**
 * @param route an AppRoute object
 * @param subsValues array of values that correspond to AppRoute subsKeys and will replace placeholders in route
 * e.g.
 * route.parent.getRoute() = ['segment1/segment2']
 * route.segments = 'segment3/:id1/segment4/:id2'
 * route.subsKeys = ['id1', 'id2']
 * subsValues = ['11', '12']
 * result is: ['/segment1/segment2/segment3/11/segment4/12']
 */
export const getRoute = (route: AppRoute, subsValues?: Array<string>): Array<string> => {
  let url = route.parent != null ? route.parent.getRoute()[0] : '';
  url = `/${url}/${route.segments}`;
  url = url.replace(/\/+/g, '/'); // replace multiple '/'
  if (subsValues != null) {
    route.subsKeys.forEach((key: string, i: number) => {
      const value = subsValues[i];
      if (value != null) {
        url = url.replace(`:${key}`, value);
      }
    });
  }
  return [url];
};

const BASE_ROUTE = {
  subsKeys: [] as Array<string>,
  getRoute(this: AppRoute, subsValues?: Array<string>) {
    return getRoute(this, subsValues);
  },
};

export class AppRoutes {
  public static readonly HOME = {
    ...BASE_ROUTE,
    segments: '',
  } as AppRoute;
  public static readonly VDR = {
    ...BASE_ROUTE,
    segments: 'vdr',
  } as AppRoute;
  public static readonly SETTINGS = {
    ...BASE_ROUTE,
    segments: 'settings',
  } as AppRoute;
  public static readonly HELP = {
    ...BASE_ROUTE,
    segments: 'help',
  } as AppRoute;
  public static readonly ABOUT = {
    ...BASE_ROUTE,
    segments: 'about',
  } as AppRoute;
  public static readonly SYSTEMS_THINKING = {
    ...BASE_ROUTE,
    segments: 'systems-thinking',
  } as AppRoute;
}

export interface AppRoute {
  readonly segments: string;
  readonly parent?: AppRoute;
  readonly subsKeys: Array<string>;
  getRoute(subsValues?: Array<string>): Array<string>;
}
