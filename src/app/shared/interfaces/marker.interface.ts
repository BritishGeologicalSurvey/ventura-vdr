export interface MarkerChangeDetails {
  changeIcon: string;
  changeTextColour: string;
  finalLabel: string;
}

export interface MarkerChangeConfig {
  baseline: string;
  difference: number;
  direction: string;
  differenceAsPercentage: number;
}

export interface MarkerScenarioConfig {
  userScenario: Array<number> | undefined;
  baselineScenario: Array<number> | undefined;
}

export interface MarkerChangeLabelConfig {
  changeIcon: string;
  changeTextColour: string;
  finalLabel: string;
  sfDifference: string;
}
