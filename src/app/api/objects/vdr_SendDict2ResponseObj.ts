import { BaseObject } from './utility/BaseObject';

export class SendDict2ResponseObj extends BaseObject {
  public static readonly KEYS = {
    MAN_FLOWS_DEMAND_2_FOUL: 'ManFlowsDemand2foul',
    MAN_RIVER_AMMONIA: 'ManRiverAmmonia',
    MAN_FOUL_TO_STORM_FLOWS: 'ManFoulToStormFlows',
    MAN_RIVER_DF_COLUMNS: 'ManRiverDFcolumns',
    MAN_RIVER_FLOWS: 'ManRiverFlows',
    MAN_RIVER_NITRATE: 'ManRiverNitrate',
    MAN_RIVER_P: 'ManRiverP',
    MAN_SEWER_DF_COLUMNS: 'ManSewerDFcolumns',
    MAN_SEWER_FLOWS: 'ManSewerFlows',
    MAN_STORM_DISCHARGE_FLOWS: 'ManStormdischargeFlows',
    MAN_WWTP_DISCHARGE_DF_COLUMNS: 'ManWWTPdischargeDFcolumns',
    MAN_WWTP_DISCHARGE_FLOWS: 'ManWWTPdischargeFlows',
    SIMULATION_DATES: 'SimulationDates',
    MAN_EXCESS_WATER: 'ManExcessWater',
  };

  public readonly manFlowsDemand2foul: Array<Array<number>>;
  public readonly manRiverAmmonia: Array<Array<number>>;
  public readonly manFoulToStormFlows: Array<Array<number>>;
  public readonly manRiverDFcolumns: Array<string>;
  public readonly manRiverFlows: Array<Array<number>>;
  public readonly manRiverNitrate: Array<Array<number>>;
  public readonly manRiverP: Array<Array<number>>;
  public readonly manSewerDFcolumns: Array<string>;
  public readonly manSewerFlows: Array<Array<number>>;
  public readonly manStormdischargeFlows: Array<Array<number>>;
  public readonly manWWTPdischargeDFcolumns: Array<string>;
  public readonly manWWTPdischargeFlows: Array<Array<number>>;
  public readonly simulationDates: Array<Date>;
  public readonly manExcessWater: Array<Array<number>>;

  constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);
    this.manFlowsDemand2foul = this.getArray(SendDict2ResponseObj.KEYS.MAN_FLOWS_DEMAND_2_FOUL);
    this.manRiverAmmonia = this.getArray(SendDict2ResponseObj.KEYS.MAN_RIVER_AMMONIA);
    this.manFoulToStormFlows = this.getArray(SendDict2ResponseObj.KEYS.MAN_FOUL_TO_STORM_FLOWS);
    this.manRiverDFcolumns = this.getArray(SendDict2ResponseObj.KEYS.MAN_RIVER_DF_COLUMNS);
    this.manRiverFlows = this.getArray(SendDict2ResponseObj.KEYS.MAN_RIVER_FLOWS);
    this.manRiverNitrate = this.getArray(SendDict2ResponseObj.KEYS.MAN_RIVER_NITRATE);
    this.manRiverP = this.getArray(SendDict2ResponseObj.KEYS.MAN_RIVER_P);
    this.manSewerDFcolumns = this.getArray(SendDict2ResponseObj.KEYS.MAN_SEWER_DF_COLUMNS);
    this.manSewerFlows = this.getArray(SendDict2ResponseObj.KEYS.MAN_SEWER_FLOWS);
    this.manStormdischargeFlows = this.getArray(SendDict2ResponseObj.KEYS.MAN_STORM_DISCHARGE_FLOWS);
    this.manWWTPdischargeDFcolumns = this.getArray(SendDict2ResponseObj.KEYS.MAN_WWTP_DISCHARGE_DF_COLUMNS);
    this.manWWTPdischargeFlows = this.getArray(SendDict2ResponseObj.KEYS.MAN_WWTP_DISCHARGE_FLOWS);
    this.simulationDates = this.getArray(SendDict2ResponseObj.KEYS.SIMULATION_DATES);
    this.manExcessWater = this.getArray(SendDict2ResponseObj.KEYS.MAN_EXCESS_WATER);
  }
}
