import { Injectable } from '@angular/core';
import { ResultComparisonType } from 'src/app/shared/enums/comparison-type.enum';
import { Nutrient } from 'src/app/shared/enums/nutrient.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { MarkerChangeConfig, MarkerScenarioConfig } from 'src/app/shared/interfaces/marker.interface';
import { SignificantFiguresPipe } from 'src/app/shared/pipes/significantFigures.pipe';
import { environment } from 'src/environments/environment.base';

import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root',
})
export class LabelDataService {
  constructor(
    private sigFig: SignificantFiguresPipe,
    private dataService: DataService,
  ) {}

  private getFormattedLabel(
    result: Array<number> | undefined,
    vdrId: number,
    sigFigs: number,
    shouldConvert: boolean = false,
  ): string {
    let convertedToMicrogramsPerLiter;
    if (result != null) {
      const resultFind = result.find((value: number, index: number) => (index === vdrId ? value : null));
      if (shouldConvert) {
        convertedToMicrogramsPerLiter = Number(resultFind) * 1000000;
        const sigFig = this.sigFig.transform(convertedToMicrogramsPerLiter, environment.sfWaterQuality);
        return `${sigFig || 'No Data'}`;
      }
      return `${resultFind ? this.sigFig.transform(Number(resultFind), sigFigs) : 'No Data'}`;
    }
    return '';
  }

  /**
   * Get label for excess water popup.
   *
   * @param {number} vdrId ID used by the API/WSI-MOD to refer to a specific subcatchment ID
   * @returns {string}
   */
  public getExcessWaterLabel(vdrId: number): string {
    let result;
    switch (this.dataService.timePeriod) {
      case ResultTimePeriod.TODAY: {
        result = this.dataService.scenario.parsedDataToday?.ManExcessWaterMean;
        break;
      }
      case ResultTimePeriod.NEAR_FUTURE: {
        result = this.dataService.scenario.parsedDataNearFuture?.ManExcessWaterMean;
        break;
      }
      case ResultTimePeriod.FAR_FUTURE: {
        result = this.dataService.scenario.parsedDataFarFuture?.ManExcessWaterMean;
        break;
      }
    }
    return this.getFormattedLabel(result, vdrId, environment.sfExcessWater);
  }

  /**
   * Get label for water flow value
   *
   * @param {number} vdrId
   * @returns {string}
   */
  public getManRiverFlowLabel(vdrId: number): string {
    let result;
    switch (this.dataService.timePeriod) {
      case ResultTimePeriod.TODAY: {
        result = this.dataService.scenario.parsedDataToday?.ManRiverFlowsMean;
        break;
      }
      case ResultTimePeriod.NEAR_FUTURE: {
        result = this.dataService.scenario.parsedDataNearFuture?.ManRiverFlowsMean;
        break;
      }
      case ResultTimePeriod.FAR_FUTURE: {
        result = this.dataService.scenario.parsedDataFarFuture?.ManRiverFlowsMean;
        break;
      }
    }
    return this.getFormattedLabel(result, vdrId, environment.sfWaterFlow);
  }

  /**
   * Get label for water quality value
   *
   * @param {number} vdrId
   * @returns {string}
   */
  public getWaterQualityLabel(vdrId: number): string {
    let result;
    switch (true) {
      case this.dataService.timePeriod === ResultTimePeriod.TODAY &&
        Nutrient.NITROGEN === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataToday?.ManRiverNitrateMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.TODAY &&
        Nutrient.PHOSPHORUS === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataToday?.ManRiverPMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.TODAY &&
        Nutrient.AMMONIA === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataToday?.ManRiverAmmoniaMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.NEAR_FUTURE &&
        Nutrient.NITROGEN === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataNearFuture?.ManRiverNitrateMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.NEAR_FUTURE &&
        Nutrient.PHOSPHORUS === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataNearFuture?.ManRiverPMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.NEAR_FUTURE &&
        Nutrient.AMMONIA === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataNearFuture?.ManRiverAmmoniaMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.FAR_FUTURE &&
        Nutrient.NITROGEN === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataFarFuture?.ManRiverNitrateMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.FAR_FUTURE &&
        Nutrient.PHOSPHORUS === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataFarFuture?.ManRiverPMean;
        break;
      }
      case this.dataService.timePeriod === ResultTimePeriod.FAR_FUTURE &&
        Nutrient.AMMONIA === this.dataService.nutrient.id: {
        result = this.dataService.scenario.parsedDataFarFuture?.ManRiverAmmoniaMean;
        break;
      }
    }
    return this.getFormattedLabel(result, vdrId, environment.sfWaterQuality, true);
  }

  /**
   * Get label values for excess water difference comparison.
   *
   * @returns {MarkerScenarioConfig}
   */
  public getExcessWaterDiffLabel(): MarkerScenarioConfig {
    const markerScenarioConfig: MarkerScenarioConfig = {
      userScenario: [],
      baselineScenario: [],
    };
    switch (this.dataService.timePeriod) {
      case ResultTimePeriod.TODAY: {
        markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataToday?.ManExcessWaterMean;
        if (this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY) {
          markerScenarioConfig.baselineScenario = this.dataService.scenarios[0].parsedDataToday?.ManExcessWaterMean;
        }
        break;
      }
      case ResultTimePeriod.NEAR_FUTURE: {
        markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataNearFuture?.ManExcessWaterMean;
        markerScenarioConfig.baselineScenario =
          this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
            ? this.dataService.scenarios[0].parsedDataToday?.ManExcessWaterMean
            : this.dataService.scenarios[0].parsedDataNearFuture?.ManExcessWaterMean;
        break;
      }
      case ResultTimePeriod.FAR_FUTURE: {
        markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataFarFuture?.ManExcessWaterMean;
        markerScenarioConfig.baselineScenario =
          this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
            ? this.dataService.scenarios[0].parsedDataToday?.ManExcessWaterMean
            : this.dataService.scenarios[0].parsedDataFarFuture?.ManExcessWaterMean;
        break;
      }
    }
    return markerScenarioConfig;
  }

  /**
   * Get label values for water flow difference comparison.
   *
   * @returns {MarkerScenarioConfig}
   */
  public getWaterFlowDiffLabel(): MarkerScenarioConfig {
    const markerScenarioConfig: MarkerScenarioConfig = {
      userScenario: [],
      baselineScenario: [],
    };
    switch (this.dataService.timePeriod) {
      case ResultTimePeriod.TODAY: {
        markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataToday?.ManRiverFlowsMean;
        if (this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY) {
          markerScenarioConfig.baselineScenario = this.dataService.scenarios[0].parsedDataToday?.ManRiverFlowsMean;
        }
        break;
      }
      case ResultTimePeriod.NEAR_FUTURE: {
        markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataNearFuture?.ManRiverFlowsMean;
        markerScenarioConfig.baselineScenario =
          this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
            ? this.dataService.scenarios[0].parsedDataToday?.ManRiverFlowsMean
            : this.dataService.scenarios[0].parsedDataNearFuture?.ManRiverFlowsMean;
        break;
      }
      case ResultTimePeriod.FAR_FUTURE: {
        markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataFarFuture?.ManRiverFlowsMean;
        markerScenarioConfig.baselineScenario =
          this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
            ? this.dataService.scenarios[0].parsedDataToday?.ManRiverFlowsMean
            : this.dataService.scenarios[0].parsedDataFarFuture?.ManRiverFlowsMean;
        break;
      }
    }
    return markerScenarioConfig;
  }

  /**
   * Get label values for water quality difference comparison.
   *
   * @returns {MarkerScenarioConfig}
   */
  public getWaterQualityDiffLabel(): MarkerScenarioConfig {
    const markerScenarioConfig: MarkerScenarioConfig = {
      userScenario: [],
      baselineScenario: [],
    };
    if (this.dataService.timePeriod === ResultTimePeriod.TODAY) {
      switch (this.dataService.nutrient.id) {
        case Nutrient.AMMONIA:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataToday?.ManRiverAmmoniaMean;
          if (this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY) {
            markerScenarioConfig.baselineScenario = this.dataService.scenarios[0].parsedDataToday?.ManRiverAmmoniaMean;
          }
          break;
        case Nutrient.NITROGEN:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataToday?.ManRiverNitrateMean;
          if (this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY) {
            markerScenarioConfig.baselineScenario = this.dataService.scenarios[0].parsedDataToday?.ManRiverNitrateMean;
          }
          break;
        case Nutrient.PHOSPHORUS:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataToday?.ManRiverPMean;
          if (this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY) {
            markerScenarioConfig.baselineScenario = this.dataService.scenarios[0].parsedDataToday?.ManRiverPMean;
          }
          break;
      }
    } else if (this.dataService.timePeriod === ResultTimePeriod.NEAR_FUTURE) {
      switch (this.dataService.nutrient.id) {
        case Nutrient.AMMONIA:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataNearFuture?.ManRiverAmmoniaMean;
          markerScenarioConfig.baselineScenario =
            this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
              ? this.dataService.scenarios[0].parsedDataToday?.ManRiverAmmoniaMean
              : this.dataService.scenarios[0].parsedDataNearFuture?.ManRiverAmmoniaMean;
          break;
        case Nutrient.NITROGEN:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataNearFuture?.ManRiverNitrateMean;
          markerScenarioConfig.baselineScenario =
            this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
              ? this.dataService.scenarios[0].parsedDataToday?.ManRiverNitrateMean
              : this.dataService.scenarios[0].parsedDataNearFuture?.ManRiverNitrateMean;
          break;
        case Nutrient.PHOSPHORUS:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataNearFuture?.ManRiverPMean;
          markerScenarioConfig.baselineScenario =
            this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
              ? this.dataService.scenarios[0].parsedDataToday?.ManRiverPMean
              : this.dataService.scenarios[0].parsedDataNearFuture?.ManRiverPMean;
          break;
      }
    } else if (this.dataService.timePeriod === ResultTimePeriod.FAR_FUTURE) {
      switch (this.dataService.nutrient.id) {
        case Nutrient.AMMONIA:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataFarFuture?.ManRiverAmmoniaMean;
          markerScenarioConfig.baselineScenario =
            this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
              ? this.dataService.scenarios[0].parsedDataToday?.ManRiverAmmoniaMean
              : this.dataService.scenarios[0].parsedDataFarFuture?.ManRiverAmmoniaMean;
          break;
        case Nutrient.NITROGEN:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataFarFuture?.ManRiverNitrateMean;
          markerScenarioConfig.baselineScenario =
            this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
              ? this.dataService.scenarios[0].parsedDataToday?.ManRiverNitrateMean
              : this.dataService.scenarios[0].parsedDataFarFuture?.ManRiverNitrateMean;
          break;
        case Nutrient.PHOSPHORUS:
          markerScenarioConfig.userScenario = this.dataService.scenario.parsedDataFarFuture?.ManRiverPMean;
          markerScenarioConfig.baselineScenario =
            this.dataService.resultComparison === ResultComparisonType.DIFFERENCE_TODAY
              ? this.dataService.scenarios[0].parsedDataToday?.ManRiverPMean
              : this.dataService.scenarios[0].parsedDataFarFuture?.ManRiverPMean;
          break;
      }
    }
    return markerScenarioConfig;
  }

  /**
   * Calculate difference in values between baseline and user scenarios.
   *
   * @param {MarkerScenarioConfig} markerScenarioConfig Config object containing user and baseline scenarios
   * @param {number} vdrId ID used by the API/WSI-MOD to refer to a specific subcatchment ID
   * @param {ResultType} resultType Type of result from excess water, water flow or water quality
   * @returns
   */
  public static calculateDifference(
    markerScenarioConfig: MarkerScenarioConfig,
    vdrId: number,
    resultType: ResultType,
  ): MarkerChangeConfig {
    if (!markerScenarioConfig.userScenario || !markerScenarioConfig.baselineScenario) {
      return {
        baseline: '0',
        difference: 0,
        direction: 'No change',
        differenceAsPercentage: 0,
      };
    }

    // Get the scenario value
    const resultFind = markerScenarioConfig.userScenario.find((value: number, index: number) =>
      index === vdrId ? value : null,
    );
    // Get the baseline today value
    const baselineFind = markerScenarioConfig.baselineScenario.find((value: number, index: number) =>
      index === vdrId ? value : null,
    );

    if (baselineFind && resultFind) {
      let difference = resultFind - baselineFind;
      let differenceAsPercentage = (difference / resultFind) * 100;

      if (resultType === ResultType.WATER_QUALITY) {
        // converting kg/m3 to Ug/l
        difference *= 1000000;
        differenceAsPercentage = (difference / (resultFind * 1000000)) * 100;
      }

      const positiveOrNegative = difference > 0 ? 'increase' : 'decrease';

      return {
        baseline: String(baselineFind),
        difference,
        direction: difference === 0 ? 'No change' : positiveOrNegative,
        differenceAsPercentage,
      };
    }
    return {
      baseline: '0',
      difference: 0,
      direction: 'No change',
      differenceAsPercentage: 0,
    };
  }
}
