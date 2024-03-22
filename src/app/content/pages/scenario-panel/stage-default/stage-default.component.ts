import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipListbox, MatChipListboxChange, MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { DialogCreateScenarioComponent } from 'src/app/shared/components/dialog-create-scenario/dialog-create-scenario.component';
import {
  DialogLearnAboutItemComponent,
  MoreInformationDialogData,
} from 'src/app/shared/components/dialog-learn-about-item/dialog-learn-about-item.component';
import { DialogLoadingResultsComponent } from 'src/app/shared/components/dialog-loading-results/dialog-loading-results.component';
import { DialogScenarioInfoComponent } from 'src/app/shared/components/dialog-scenario-info/dialog-scenario-info.component';
import { ResultComparisonType } from 'src/app/shared/enums/comparison-type.enum';
import { ComparisonItem, ModelResultsItem, ResultsComparisonItem } from 'src/app/shared/enums/default-stage.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';
import { descriptions } from 'src/assets/data/scenario-descriptions';
import { environment } from 'src/environments/environment.base';

import { MapService } from '../../tabs/pages/map/services/map.service';

@Component({
  selector: 'app-stage-default',
  templateUrl: './stage-default.component.html',
  styleUrls: ['./stage-default.component.scss'],
})
export class StageDefaultComponent implements OnInit, OnDestroy {
  public scenarios: Array<NewScenario | BaselineScenario> = [];
  @Input() public set options(res: Array<NewScenario | BaselineScenario>) {
    if (res != null) {
      this.scenarios = res;
      this.selectedScenarioOption = this.scenarios.find(
        (scenario: NewScenario | BaselineScenario) => scenario.scenarioId === this.activeScenarioID,
      )?.scenarioId;
    }
  }
  @Output() public defaultComplete: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @ViewChild('displayResultComparison') public displayResultComparison?: MatChipListbox;

  public modelResults: ModelResultsItem[] = [
    {
      type: ResultType.WATER_FLOW,
      summary: `(${environment.waterFlowUnits}) Volume flowing through a known point.`,
      description: `(${environment.waterFlowUnits}) Water flow refers to the volume of water that is moving through a particular point or section of a river, stream, or other waterway.`,
    },
    {
      type: ResultType.EXCESS_WATER,
      summary: `(${environment.excessWaterUnits}) Fallen precipitation which has not infiltrated into groundwater.`,
      description: `(${environment.excessWaterUnits}) Excess water refers to the amount of water that exceeds the storage capacity of a particular water system and can lead to flooding or other water management issues.`,
    },
    {
      type: ResultType.WATER_QUALITY,
      summary: `(${environment.waterQualityUnits}) Nutrient concentrations.`,
      description: `(${environment.waterQualityUnits}) Water quality refers to the nutrient concentrations of water that determine its suitability for specific uses, such as drinking, swimming, or irrigation.`,
    },
  ];
  public compareResults: ComparisonItem[] = [
    {
      type: ResultComparisonType.DIFFERENCE_TODAY,
      summary: 'Difference with baseline',
      description:
        'Compare your intervention choices with the selected CC & population changes against 2011/2012 baseline',
    },
    {
      type: ResultComparisonType.DIFFERENCE_BAU,
      summary: 'Difference with no interventions',
      description:
        'Compare your intervention choices against no interventions for the same with the same selected CC & population scenario',
    },
  ];

  public selectedModelResultOptions: ResultType[] = [ResultType.WATER_FLOW];
  public rt = ResultType;
  public rtp = ResultTimePeriod;
  public selectedScenarioOption!: string | undefined;
  public selectedComparisonOption: ResultComparisonType[] = [];
  private activeScenarioID = '';
  private lastClickValue = 1;
  private stop$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private mapService: MapService,
    private scenarioService: ScenarioService,
  ) {}

  public ngOnInit(): void {
    this.initSubscriptions();
  }

  public ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  private initSubscriptions(): void {
    this.scenarioService.activeScenarioObservable.pipe(takeUntil(this.stop$)).subscribe((activeScenarioID: string) => {
      if (this.activeScenarioID !== activeScenarioID) {
        this.scenarioService.getAllScenarios().subscribe((ls: unknown) => {
          if (ls) {
            this.scenarios = JSON.parse(ls as string) as Array<NewScenario | BaselineScenario>;
            this.activeScenarioID = activeScenarioID;
            this.selectedScenarioOption = activeScenarioID;
          }
        });
      }
    });
  }

  public handleCreateScenario(): void {
    const dialogRef = this.dialog.open(DialogCreateScenarioComponent, { panelClass: 'create-scenario' });
    dialogRef.afterClosed().subscribe((data) => {
      if (data != null) {
        this.mapService.updateSubcatchmentSelectionSymbology();
        this.defaultComplete.emit(data);
        this.mapService.resetFilterLayer();
        this.mapService.updatePanelResultsVisibility(false);
      }
    });
  }

  public selectedModelResultChange() {
    this.mapService.updateResultsLayer(this.selectedModelResultOptions[0]);
  }

  public selectedComparisonChange(event: MatChipSelectionChange) {
    const comparisonItem: ResultsComparisonItem = {
      comparisonType: event.source.value,
      display: event.selected,
    };
    this.mapService.updateScenarioComparisonOptionsSelection(comparisonItem);
  }

  public selectedDisplayValueChange(event: MatChipListboxChange) {
    if (event.value === undefined) {
      this.displayResultComparison?.writeValue(this.lastClickValue);
    } else if (event.value !== this.lastClickValue) {
      this.mapService.updateDisplayValueSource(event.value);
      this.lastClickValue = event.value;
    }
  }

  public changeResultTimePeriod(timePeriod: ResultTimePeriod) {
    this.mapService.updateResultsTimePeriod(timePeriod);
  }

  public changeResultLayer(resultType: ResultType) {
    this.mapService.updateResultsLayer(resultType);
  }

  public scenarioSelectionChange(event: MatSelectChange): void {
    this.scenarioService.setActiveScenario(event.value);
    if (event.value === 'business-as-usual') {
      // reset the difference from baseline comparison
      this.selectedComparisonOption = [];
    }
  }

  public openLearnAboutItemDialog(source: string): void {
    const moreInfoContent: MoreInformationDialogData = {
      title: '',
      subheading: '',
      content: [],
    };
    switch (source) {
      case 'time':
        moreInfoContent.title = 'CC & Population Scenarios';
        moreInfoContent.content = [
          'You can explore how water flow, excess water and water quality is expected to change in response to changes in population and in rainfall rate due to climate change. The size of the population and intensity of rainfall (due to climate change) affect the model results.',
          'Baseline represents the water system for the default time period selected in the CC & Population Settings (30/11/2011 - 30/01/2012). This equates to 55 mm of rainfall over 2 for the whole of the Upper Mersey. This represents an catchment wide extrapolation of the two wettest days over the 2-year period.',
          'Modest change represents a 20% increase in population and rainfall due to CC.',
          'Major change represent a 20% increase in population and 50% increase in climate induced rainfall.',
          'When choosing a scenario, please consider the situation that your organisation and collaborators will prioritise with regards to intervention planning.',
        ];
        break;
      case 'model':
        moreInfoContent.title = 'Model Results';
        moreInfoContent.content = [
          'Water flow: More permeable land can decrease the risks of flooding, but more new urban developments will decrease permeable land. Increases in flow over time lead to a potential increase in risk of surface water flooding and impacts on in-river water quality if no system interventions are made (baseline condition). This model shows discharge of water from one subcatchment downstream, measured in m^3/s.',
          'Excess water: Combined sewage overflow is one of the most common risks of flooding in Northern England due to the combined sewer systems. Climate change can increase the amount of excess water as a result of increased rainfall. This shows discharge of water that is not absorbed into the land from one subcatchment downstream, measured in m^3/s.',
          'Water quality: Water quality (WQ) is defined by proxy as the concentration of nitrates, phosphate and ammonia at each subcatchment outlet. You can choose which compound via the drop down menu in the results panel. The units are [kg/m^3].',
        ];
        break;
      default:
        moreInfoContent.title = 'Compare Scenarios';
        moreInfoContent.content = [
          'With this tool, you can compare the impact of your interventions on a given scenario. We provide two key methods for comparison: the baseline scenario and the no-intervention scenario.',
          'Baseline Scenario: The baseline scenario represents the existing conditions in the winter of 2011/2012, before any interventions take place. It serves as a reference point against which you can measure the effects of your proposed intervention. By comparing your intervention to the baseline scenario, you can assess the extent to which it improves or modifies the existing conditions.',
          'No-Intervention Scenario: The no-intervention scenario acts as a hypothetical situation where no intervention or action is taken, but you can still explore the projections on how modest or extreme changes would affect Greater Manchester. This comparison helps you understand the potential consequences of inaction or maintaining the status quo. By comparing your intervention to the no-intervention scenario, you can gauge the positive or negative changes your intervention brings compared to doing nothing.',
        ];
        break;
    }

    const config = {
      data: moreInfoContent,
      maxWidth: '30vw',
    };
    this.dialog.open(DialogLearnAboutItemComponent, config);
  }

  public testDialog(): void {
    this.dialog.open(DialogLoadingResultsComponent, {
      width: '50vw',
      maxWidth: '50vw',
      disableClose: true,
    });
  }

  private getScenarioDescription(): Record<string, string> | undefined {
    return Object.values(descriptions).find((item) => item['id'] === this.activeScenarioID);
  }

  public handleLearnMore(): void {
    const match = Object.values(descriptions).find((item) => item['id'] === this.activeScenarioID);
    if (match) {
      this.dialog.open(DialogScenarioInfoComponent, {
        data: match,
        width: '35vw',
        height: '35vh',
      });
    }
  }

  public scenarioHasDescription(): boolean {
    return this.getScenarioDescription() != null;
  }
}
