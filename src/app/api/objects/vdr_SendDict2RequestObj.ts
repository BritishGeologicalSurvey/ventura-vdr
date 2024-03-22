import { SimpleSendDict2RequestObj } from './simpleObjects/SimpleSendDict2RequestObj';

export class SendDict2RequestObj {
  public readonly nodes_numbers_to_change: Array<number>;
  public readonly RC_to_change: Array<number> | Array<string>;
  public readonly catchmentN4populationChange: Array<number>;
  public readonly PopulationChange: Array<number>;
  public readonly StartDate: string;
  public readonly EndDate: string;
  public readonly RainfallMultiplier: number;
  public readonly PopulationGrowth: number;
  public readonly catchmentN4wiltPointChange: Array<number>;
  public readonly newWiltPointMultiplier: Array<number>;
  public readonly catchmentN4demandChange: Array<number>;
  public readonly NewPerCapitaDemand: Array<number> | Array<string>;
  public readonly days2delete: number;
  public readonly MinSimLength: number;

  constructor(obj: SimpleSendDict2RequestObj) {
    this.nodes_numbers_to_change = obj.nodes_numbers_to_change;
    this.RC_to_change = obj.RC_to_change;
    this.catchmentN4populationChange = obj.catchmentN4populationChange;
    this.PopulationChange = obj.PopulationChange;
    this.StartDate = obj.StartDate;
    this.EndDate = obj.EndDate;
    this.RainfallMultiplier = obj.RainfallMultiplier;
    this.PopulationGrowth = obj.PopulationGrowth;
    this.catchmentN4wiltPointChange = obj.catchmentN4wiltPointChange;
    this.newWiltPointMultiplier = obj.newWiltPointMultiplier;
    this.catchmentN4demandChange = obj.catchmentN4demandChange;
    this.NewPerCapitaDemand = obj.NewPerCapitaDemand;
    this.days2delete = obj.days2delete;
    this.MinSimLength = obj.MinSimLength;
  }

  public createRequestString(): string {
    const formattedString = `{'nodes_numbers_to_change': [${this.nodes_numbers_to_change}], 'RC_to_change': [${this.RC_to_change}], 'catchmentN4populationChange': [${this.catchmentN4populationChange}], 'PopulationChange': [${this.PopulationChange}], 'StartDate': '${this.StartDate}', 'EndDate': '${this.EndDate}', 'RainfallMultiplier': ${this.RainfallMultiplier}, 'PopulationGrowth': ${this.PopulationGrowth}, 'catchmentN4wiltPointChange': [${this.catchmentN4wiltPointChange}], 'newWiltPointMultiplier': [${this.newWiltPointMultiplier}], 'catchmentN4demandChange': [${this.catchmentN4demandChange}], 'NewPerCapitaDemand': [${this.NewPerCapitaDemand}], 'days2delete': ${this.days2delete}, 'MinSimLength': ${this.MinSimLength}}`;
    return formattedString;
  }
}
