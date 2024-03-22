import { ParsedData } from '../objects/parsedData';

export type BaselineScenario = {
  scenarioName?: string;
  description?: string;
  scenarioId?: string;
  parsedDataToday?: ParsedData;
  parsedDataNearFuture?: ParsedData | null;
  parsedDataFarFuture?: ParsedData | null;
};

export type NewScenario = {
  // dynamic properties
  [key: string]: Record<string, unknown>;
} & {
  // static properties
  editArray?: Array<ScenarioEditStage>;
  scenarioName?: string;
  description?: string;
  scenarioId?: string;
  currentGroup?: number;
  currentStage?: string;
  currentQuery?: string;
  ids?: Array<number>;
  parsedDataToday?: ParsedData;
  parsedDataNearFuture?: ParsedData | null;
  parsedDataFarFuture?: ParsedData | null;
  activeSubcatchmentProperties?: Array<SubcatchmentProperties>;
};

export type AllScenarios = BaselineScenario | NewScenario;

export interface ScenarioMapping {
  fieldName: string;
  inputName: string;
}

export interface SubcatchmentProperties {
  OBJECTID: number;
  VDR_ID: number;
  WB_NAME: string;
  GROUP_ID: number;
  Runoff_coe: number;
  Green_Spac: number;
  Population: number;
  Prop_imper: number;
  Near_term_: number;
  Far_term_d: number;
  Water_dema: number;
  Shape__Area: number;
  Shape__Length: number;
}

export interface ScenarioEditStage extends Record<string, unknown> {
  groupId?: number;
  rcForNewDevelopment: string;
  attenuationVol: string;
  waterDemandForNewDevelopment: string;
  overallAreaForNewDevelopment: string;
  retrofitRC: string;
  retrofitPropertiesAppliedTo: string;
  retrofitWaterDemand: string;
  toggleRetrofitRC: boolean; // should RC_to_change formula be run or not
}

export enum CurrentStage {
  DEFAULT = '',
  SELECT = 'select',
  EDIT = 'edit',
  REVIEW = 'review',
}

export type NearFarTermMappingRecord = {
  RainfallMultiplier: number;
  PopulationGrowth: number;
  PopulationChange: Array<number>;
  newPerCapitaDemand: Array<number>;
  rcToChange: Array<number>;
};

export interface NearFarTermMapping {
  [key: string]: NearFarTermMappingRecord;
}

export interface EditTableSource {
  id: string;
  name: string;
  currentVal: number | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newVal: any;
}
