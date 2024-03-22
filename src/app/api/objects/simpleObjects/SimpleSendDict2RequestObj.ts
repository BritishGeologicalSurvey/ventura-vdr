export interface SimpleSendDict2RequestObj {
  nodes_numbers_to_change: Array<number>;
  RC_to_change: Array<number> | Array<string>;
  catchmentN4populationChange: Array<number>;
  PopulationChange: Array<number>;
  StartDate: string;
  EndDate: string;
  RainfallMultiplier: number;
  PopulationGrowth: number;
  catchmentN4wiltPointChange: Array<number>;
  newWiltPointMultiplier: Array<number>;
  catchmentN4demandChange: Array<number>;
  NewPerCapitaDemand: Array<number> | Array<string>;
  days2delete: number;
  MinSimLength: number;
}
