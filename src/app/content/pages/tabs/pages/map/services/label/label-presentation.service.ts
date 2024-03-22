import { Injectable } from '@angular/core';
import { DisplayValueOption } from 'src/app/shared/enums/display-type.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import {
  MarkerChangeConfig,
  MarkerChangeDetails,
  MarkerChangeLabelConfig,
  MarkerScenarioConfig,
} from 'src/app/shared/interfaces/marker.interface';
import { SignificantFiguresPipe } from 'src/app/shared/pipes/significantFigures.pipe';
import { environment } from 'src/environments/environment.base';

import { DataService } from '../data.service';
import { LabelDataService } from './label-data.service';

@Injectable({
  providedIn: 'root',
})
export class LabelPresentationService {
  constructor(
    private dataService: DataService,
    private sigFig: SignificantFiguresPipe,
    private labelDataService: LabelDataService,
  ) {}

  private getFormattedLabel(difference: number | string, sigFigs: number): string {
    return String(this.sigFig.transform(Number(difference), sigFigs));
  }

  /**
   * Get label for difference value in scenario comparison.
   *
   * @param vdrId ID used by the API/WSI-MOD to refer to a specific subcatchment ID
   * @param resultType Result type from excess water, water flow or excess water
   * @returns {MarkerChangeConfig}
   */
  public getDifferenceLabel(vdrId: number, resultType: ResultType): MarkerChangeConfig {
    let markerScenarioConfig!: MarkerScenarioConfig;
    if (resultType === ResultType.EXCESS_WATER) {
      markerScenarioConfig = this.labelDataService.getExcessWaterDiffLabel();
    } else if (resultType === ResultType.WATER_FLOW) {
      markerScenarioConfig = this.labelDataService.getWaterFlowDiffLabel();
    } else {
      markerScenarioConfig = this.labelDataService.getWaterQualityDiffLabel();
    }
    return LabelDataService.calculateDifference(markerScenarioConfig, vdrId, resultType);
  }

  private getDiffMarkerIncrease(changeLabel: MarkerChangeConfig, sfDifference: string): MarkerChangeLabelConfig {
    const labelConfig: MarkerChangeLabelConfig = {
      changeIcon: '',
      changeTextColour: '',
      finalLabel: '',
      sfDifference,
    };
    if (changeLabel.difference > 0) {
      labelConfig.changeTextColour = 'text-bgs-secondary-haze';

      if (this.dataService.resultType === ResultType.EXCESS_WATER) {
        labelConfig.changeIcon = 'centroid-increase.svg';
      } else {
        labelConfig.changeIcon = 'outlet-increase.svg';
      }

      if (this.dataService.displayOption === DisplayValueOption.DIFFERENCE) {
        labelConfig.finalLabel = `${labelConfig.sfDifference}`;
      } else if (this.dataService.displayOption === DisplayValueOption.PERCENT) {
        // When viewing change as a percentage, only show change above a tolerance level
        if (Math.abs(changeLabel.differenceAsPercentage) < 0.001) {
          labelConfig.changeIcon =
            this.dataService.resultType === ResultType.EXCESS_WATER ? 'centroid.svg' : 'outlet.svg';
          labelConfig.finalLabel = 'No change';
          labelConfig.changeTextColour = '';
        } else {
          labelConfig.finalLabel = `+${changeLabel.differenceAsPercentage.toFixed(3)}%`;
        }
      }
    }
    return labelConfig;
  }

  private getDiffMarkerDecrease(changeLabel: MarkerChangeConfig, sfDifference: string): MarkerChangeLabelConfig {
    const labelConfig: MarkerChangeLabelConfig = {
      changeIcon: '',
      changeTextColour: '',
      finalLabel: '',
      sfDifference,
    };
    if (changeLabel.difference < 0) {
      labelConfig.changeTextColour = 'text-bgs-secondary-grass';

      if (this.dataService.resultType === ResultType.EXCESS_WATER) {
        labelConfig.changeIcon = 'centroid-decrease.svg';
      } else {
        labelConfig.changeIcon = 'outlet-decrease.svg';
      }

      if (this.dataService.displayOption === DisplayValueOption.DIFFERENCE) {
        labelConfig.finalLabel = `${labelConfig.sfDifference}`;
      } else if (this.dataService.displayOption === DisplayValueOption.PERCENT) {
        // When viewing change as a percentage, only show change above a tolerance level
        if (Math.abs(changeLabel.differenceAsPercentage) < 0.001) {
          labelConfig.changeIcon =
            this.dataService.resultType === ResultType.EXCESS_WATER ? 'centroid.svg' : 'outlet.svg';
          labelConfig.finalLabel = 'No change';
          labelConfig.changeTextColour = '';
        } else {
          labelConfig.finalLabel = `${changeLabel.differenceAsPercentage.toFixed(3)}%`;
        }
      }
    }
    return labelConfig;
  }

  public createDiffMarkerFinalLabel(
    vdrId: number,
    waterFlowCallback: () => void,
    waterQualityCallback: () => void,
  ): MarkerChangeDetails {
    const changeLabel: MarkerChangeConfig = this.getDifferenceLabel(vdrId, this.dataService.resultType);
    let labelConfig: MarkerChangeLabelConfig = {
      changeIcon: '',
      changeTextColour: '',
      finalLabel: '',
      sfDifference: '',
    };

    if (this.dataService.resultType === ResultType.WATER_FLOW) {
      labelConfig.sfDifference = this.getFormattedLabel(changeLabel.difference, environment.sfWaterFlow);
      waterFlowCallback();
    } else if (this.dataService.resultType === ResultType.WATER_QUALITY) {
      labelConfig.sfDifference = this.getFormattedLabel(changeLabel.difference, environment.sfWaterQuality);
      waterQualityCallback();
    } else {
      labelConfig.sfDifference = this.getFormattedLabel(changeLabel.difference, environment.sfExcessWater);
    }

    switch (changeLabel.direction) {
      case 'increase':
        labelConfig = { ...labelConfig, ...this.getDiffMarkerIncrease(changeLabel, labelConfig.sfDifference) };
        break;
      case 'decrease':
        labelConfig = { ...labelConfig, ...this.getDiffMarkerDecrease(changeLabel, labelConfig.sfDifference) };
        break;
      default:
        labelConfig.changeIcon =
          this.dataService.resultType === ResultType.EXCESS_WATER ? 'centroid.svg' : 'outlet.svg';
        labelConfig.finalLabel = 'No change';
    }

    const item: MarkerChangeDetails = {
      changeIcon: labelConfig.changeIcon,
      changeTextColour: labelConfig.changeTextColour,
      finalLabel: labelConfig.finalLabel,
    };
    return item;
  }

  public createDiffPopupFinalLabel(vdrId: number, sfProperty: number, units: string): string {
    let label = '';
    const changeLabel: MarkerChangeConfig = this.getDifferenceLabel(vdrId, this.dataService.resultType);
    const sfDifference = String(this.sigFig.transform(Number(changeLabel.difference), sfProperty));

    if (changeLabel.direction === 'increase' && changeLabel.difference > 0) {
      label = `Increase of ${sfDifference} ${units} (+${changeLabel.differenceAsPercentage.toFixed(3)}%)`;
    } else if (changeLabel.direction === 'decrease' && changeLabel.difference < 0) {
      label = `Decrease of ${sfDifference} ${units} (${changeLabel.differenceAsPercentage.toFixed(3)}%)`;
    } else {
      label = 'No change';
    }
    return label;
  }
}
