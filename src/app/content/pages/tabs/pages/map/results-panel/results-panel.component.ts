import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { ResultComparisonType } from 'src/app/shared/enums/comparison-type.enum';
import { ResultsComparisonItem } from 'src/app/shared/enums/default-stage.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';
import { CompoundList } from 'src/app/shared/objects/compoundList';
import { environment } from 'src/environments/environment.base';

import { MapService } from '../services/map.service';

export interface ThresholdConfig {
  range: string;
  text: string;
  icon: string;
}

@Component({
  selector: 'app-results-panel',
  templateUrl: './results-panel.component.html',
  styleUrls: ['./results-panel.component.scss'],
})
export class ResultsPanelComponent {
  public rt = ResultType;
  public rtp = ResultTimePeriod;
  public rtLabel = ResultType.WATER_FLOW;
  public rtpLabel = '';
  public compoundList = CompoundList;
  public selectedCompound = CompoundList[0];
  public selectedThresholdLegend: ThresholdConfig[] = [];
  public activeScenario? = '';
  public activeComparisonItem!: ResultsComparisonItem;

  public thresholdLegendWaterFlow: ThresholdConfig[] = [
    {
      range: `0-10,000 ${environment.waterFlowUnits}`,
      text: 'Low',
      icon: 'assets/icons/outlet.svg',
    },
    {
      range: `10,000-25,000 ${environment.waterFlowUnits}`,
      text: 'Medium',
      icon: 'assets/icons/outlet.svg',
    },
    {
      range: `25,000+ ${environment.waterFlowUnits}`,
      text: 'High',
      icon: 'assets/icons/outlet.svg',
    },
  ];
  public thresholdLegendWaterFlowWithDifference: ThresholdConfig[] = [
    {
      range: '',
      text: 'Decrease in flowrate',
      icon: 'assets/icons/outlet-decrease.svg',
    },
    {
      range: '',
      text: 'Increase in flowrate',
      icon: 'assets/icons/outlet-increase.svg',
    },
    {
      range: '',
      text: 'No change',
      icon: 'assets/icons/outlet.svg',
    },
  ];

  public thresholdLegendExcessWater: ThresholdConfig[] = [
    {
      range: `0-1000 ${environment.excessWaterUnits}`,
      text: 'Low',
      icon: 'assets/icons/centroid.svg',
    },
    {
      range: `1001-2000 ${environment.excessWaterUnits}`,
      text: 'Medium',
      icon: 'assets/icons/centroid.svg',
    },
    {
      range: `2000+${environment.excessWaterUnits}`,
      text: 'High',
      icon: 'assets/icons/centroid.svg',
    },
  ];
  public thresholdLegendExcessWaterWithDifference: ThresholdConfig[] = [
    {
      range: '',
      text: 'Decrease in volume',
      icon: 'assets/icons/centroid-decrease.svg',
    },
    {
      range: '',
      text: 'Increase in volume',
      icon: 'assets/icons/centroid-increase.svg',
    },
    {
      range: '',
      text: 'No change',
      icon: 'assets/icons/centroid.svg',
    },
  ];
  public thresholdLegendWaterQuality: ThresholdConfig[] = [
    {
      range: `-0.05-0.00 ${environment.waterQualityUnits}`,
      text: 'Low',
      icon: 'assets/icons/outlet.svg',
    },
    {
      range: `0.00-0.05 ${environment.waterQualityUnits}`,
      text: 'Medium-Low',
      icon: 'assets/icons/outlet.svg',
    },
    {
      range: `0.05-0.10 ${environment.waterQualityUnits}`,
      text: 'Medium-High',
      icon: 'assets/icons/outlet.svg',
    },
    {
      range: `0.10-0.15 ${environment.waterQualityUnits}`,
      text: 'High',
      icon: 'assets/icons/outlet.svg',
    },
  ];

  public thresholdLegendWaterQualityWithDifference: ThresholdConfig[] = [
    {
      range: '',
      text: 'Decrease in concentration',
      icon: 'assets/icons/outlet-decrease.svg',
    },
    {
      range: '',
      text: 'Increase in concentration',
      icon: 'assets/icons/outlet-increase.svg',
    },
    {
      range: '',
      text: 'No change',
      icon: 'assets/icons/outlet.svg',
    },
  ];

  constructor(
    private mapService: MapService,
    private scenarioService: ScenarioService,
  ) {
    this.mapService.resultsLayerSourceObservable.subscribe((resultType: ResultType) => {
      this.rtLabel = resultType;
      this.updateLegend(this.rtLabel);
    });
    this.mapService.resultsTimePeriodSourceObservable.subscribe((timePeriod: ResultTimePeriod) => {
      this.rtpLabel = timePeriod;
    });
    this.mapService.scenarioResultsComparisonSelectedObservable.subscribe((comparisonItem: ResultsComparisonItem) => {
      this.activeComparisonItem = comparisonItem;
      this.updateLegend(this.rtLabel);
    });
    this.scenarioService.activeScenarioObservable.subscribe((id: string) => {
      this.scenarioService.getScenarioById(id).subscribe((value: NewScenario | BaselineScenario | undefined) => {
        if (value) {
          this.activeScenario = value.scenarioName;
          // This triggers the legend to return to its non-comparison form.
          if (this.activeScenario === 'Business as usual') {
            const triggerReset: ResultsComparisonItem = {
              comparisonType: ResultComparisonType.DIFFERENCE_BAU,
              display: false,
            };
            this.mapService.updateScenarioComparisonOptionsSelection(triggerReset);
          }
        }
      });
    });
  }

  public handleChange(event: MatSelectChange): void {
    this.mapService.setActiveNnutrient(event.value);
  }

  private updateLegend(resultType: ResultType): void {
    switch (resultType) {
      case ResultType.WATER_FLOW:
        if (this.activeComparisonItem && this.activeComparisonItem.display === true) {
          this.selectedThresholdLegend = this.thresholdLegendWaterFlowWithDifference;
        } else {
          this.selectedThresholdLegend = this.thresholdLegendWaterFlow;
        }
        break;
      case ResultType.EXCESS_WATER:
        if (this.activeComparisonItem && this.activeComparisonItem.display === true) {
          this.selectedThresholdLegend = this.thresholdLegendExcessWaterWithDifference;
        } else {
          this.selectedThresholdLegend = this.thresholdLegendExcessWater;
        }
        break;
      default:
        if (this.activeComparisonItem && this.activeComparisonItem.display === true) {
          this.selectedThresholdLegend = this.thresholdLegendWaterQualityWithDifference;
        } else {
          this.selectedThresholdLegend = this.thresholdLegendWaterQuality;
        }
        break;
    }
  }
}
