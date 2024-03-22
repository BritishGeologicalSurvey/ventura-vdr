import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { concat, toArray } from 'rxjs';
import { ApiService } from 'src/app/api/api.service';
import { SendDict2RequestObj } from 'src/app/api/objects/vdr_SendDict2RequestObj';
import { SendDict2ResponseObj } from 'src/app/api/objects/vdr_SendDict2ResponseObj';
import { PageLoadingService } from 'src/app/core/services/pageLoadingService.service';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import {
  farTermPopulationGrowth,
  farTermRainfallMultiplier,
  nearTermPopulationGrowth,
  nearTermRainfallMultiplier,
  populationIncreasedWithNewDevelopment,
} from 'src/app/shared/calculations/constants';
import {
  calculateNewDemand,
  calculatePopulationChange,
  calculateRcToChange,
} from 'src/app/shared/calculations/formulae';
import { DialogLoadingResultsComponent } from 'src/app/shared/components/dialog-loading-results/dialog-loading-results.component';
import {
  BaselineScenario,
  NearFarTermMapping,
  NearFarTermMappingRecord,
  NewScenario,
  ScenarioEditStage,
  SubcatchmentProperties,
} from 'src/app/shared/models/scenario.model';
import { ParsedData } from 'src/app/shared/objects/parsedData';
import { BaselineToday } from 'src/assets/data/baseline-today';

import { MapService } from '../../tabs/pages/map/services/map.service';

@Component({
  selector: 'app-stage-review',
  templateUrl: './stage-review.component.html',
  styleUrls: ['./stage-review.component.scss'],
})
export class StageReviewComponent implements OnInit {
  @Input() public noOfCatchments = 0;
  @Output() public reviewComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public reviewAddMore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public reviewCancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  private newScenario!: NewScenario;
  private allScenarios: Array<NewScenario | BaselineScenario> = [];
  private nearFarTermMapping: NearFarTermMapping = {};

  constructor(
    private scenarioService: ScenarioService,
    private apiService: ApiService,
    private mapService: MapService,
    private loadingService: PageLoadingService,
    public dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.initWatchers();
    this.nearFarTermMapping = {
      nearTerm: {
        RainfallMultiplier: nearTermRainfallMultiplier,
        PopulationGrowth: nearTermPopulationGrowth,
        newPerCapitaDemand: [],
        rcToChange: [],
        PopulationChange: [],
      },
      farTerm: {
        RainfallMultiplier: farTermRainfallMultiplier,
        PopulationGrowth: farTermPopulationGrowth,
        newPerCapitaDemand: [],
        rcToChange: [],
        PopulationChange: [],
      },
    };
  }

  private initWatchers(): void {
    this.scenarioService.newScenarioObservable.subscribe((newScenario: NewScenario) => {
      this.newScenario = newScenario;
    });
    this.scenarioService.getAllScenarios().subscribe((ls: unknown) => {
      if (ls) {
        const data = JSON.parse(ls as string) as Array<NewScenario | BaselineScenario>;
        this.allScenarios = data;
      }
    });
  }

  private sendRequest(
    rainfallMultiplier: number,
    populationGrowth: number,
    rcToChange: Array<number>,
    newPerCapitaDemand: Array<number>,
    populationChange: Array<number>,
  ): Promise<SendDict2ResponseObj> {
    if (this.newScenario.editArray && this.newScenario.editArray[0].toggleRetrofitRC === false) {
      // user does not want to send the calculated RC nor the nodes_numbers_to_change
      const body = new SendDict2RequestObj({
        nodes_numbers_to_change: [], // dont send any nodes to change
        RC_to_change: [], // dont send any calculated formula
        catchmentN4populationChange: this.newScenario.ids ? this.newScenario.ids : [],
        PopulationChange: populationChange,
        StartDate: '2011-11-30',
        EndDate: '2012-01-30',
        RainfallMultiplier: rainfallMultiplier,
        PopulationGrowth: populationGrowth,
        catchmentN4wiltPointChange: [],
        newWiltPointMultiplier: [],
        catchmentN4demandChange: this.newScenario.ids ? this.newScenario.ids : [],
        NewPerCapitaDemand: newPerCapitaDemand,
        days2delete: 100,
        MinSimLength: 2,
      });
      return this.apiService.getData(body);
    }
    const body = new SendDict2RequestObj({
      nodes_numbers_to_change: this.newScenario.ids ? this.newScenario.ids : [],
      RC_to_change: rcToChange,
      catchmentN4populationChange: this.newScenario.ids ? this.newScenario.ids : [],
      PopulationChange: populationChange,
      StartDate: '2011-11-30',
      EndDate: '2012-01-30',
      RainfallMultiplier: rainfallMultiplier,
      PopulationGrowth: populationGrowth,
      catchmentN4wiltPointChange: [],
      newWiltPointMultiplier: [],
      catchmentN4demandChange: this.newScenario.ids ? this.newScenario.ids : [],
      NewPerCapitaDemand: newPerCapitaDemand,
      days2delete: 100,
      MinSimLength: 2,
    });
    return this.apiService.getData(body);
  }

  private mapData(
    activeSubcatchmentProperties: Array<SubcatchmentProperties>,
    editedValsArr: Array<ScenarioEditStage>,
  ): void {
    if (activeSubcatchmentProperties.length > 0) {
      Object.keys(this.nearFarTermMapping).forEach((key: string) => {
        activeSubcatchmentProperties.forEach((subcatchment: SubcatchmentProperties) => {
          const groupId = subcatchment.GROUP_ID;
          const newPerCapitaDemand = calculateNewDemand(
            Number(editedValsArr[groupId].retrofitPropertiesAppliedTo),
            Number(editedValsArr[groupId].retrofitWaterDemand),
            subcatchment.Population,
            Number(editedValsArr[groupId].overallAreaForNewDevelopment),
            Number(editedValsArr[groupId].waterDemandForNewDevelopment),
            subcatchment.Water_dema,
            // eslint-disable-next-line no-underscore-dangle
            key === 'nearTerm' ? subcatchment.Near_term_ : subcatchment.Far_term_d,
          );
          const rcToChange = calculateRcToChange(
            Number(editedValsArr[groupId].retrofitRC),
            Number(editedValsArr[groupId].overallAreaForNewDevelopment),
            Number(editedValsArr[groupId].rcForNewDevelopment),
            subcatchment.Shape__Area,
            // eslint-disable-next-line no-underscore-dangle
            key === 'nearTerm' ? subcatchment.Near_term_ : subcatchment.Far_term_d,
          );
          const populationChange = calculatePopulationChange(
            subcatchment.Population,
            Number(editedValsArr[groupId].overallAreaForNewDevelopment),
            populationIncreasedWithNewDevelopment,
          );

          this.nearFarTermMapping[key].newPerCapitaDemand.push(newPerCapitaDemand);
          this.nearFarTermMapping[key].rcToChange.push(rcToChange);
          this.nearFarTermMapping[key].PopulationChange.push(populationChange);
        });
      });
    }
  }

  public cancelNewScenario(): void {
    this.reviewCancel.emit(true);
  }

  public handleAddMore(): void {
    if (this.newScenario.activeSubcatchmentProperties) {
      this.mapService.setSubcatchmentProperties(this.newScenario.activeSubcatchmentProperties);
      this.reviewAddMore.emit(true);
    }
  }

  private mapApiCalls(): Promise<SendDict2ResponseObj>[] {
    if (this.newScenario) {
      return Object.values(this.nearFarTermMapping).map((record: NearFarTermMappingRecord) =>
        this.sendRequest(
          record.RainfallMultiplier,
          record.PopulationGrowth,
          record.rcToChange,
          record.newPerCapitaDemand,
          record.PopulationChange,
        ),
      );
    }
    return new Array<Promise<SendDict2ResponseObj>>();
  }

  public handleReview(): void {
    this.dialog.open(DialogLoadingResultsComponent, {
      width: '50vw',
      maxWidth: '50vw',
      disableClose: true,
      panelClass: 'loading-results',
    });
    const { activeSubcatchmentProperties } = this.newScenario;
    const editedVals = this.newScenario.editArray as Array<ScenarioEditStage>;

    if (activeSubcatchmentProperties) {
      this.mapData(activeSubcatchmentProperties, editedVals);
    }

    concat(...this.mapApiCalls())
      .pipe(toArray())
      .subscribe((data) => {
        if (data[0].manFlowsDemand2foul.length === 0) {
          this.loadingService.showLoading(false);
          return;
        }

        const nearDataParsed = new ParsedData(data[0]);
        this.scenarioService
          .cacheNewScenarioInArray({
            ...Object.assign(this.newScenario, {
              parsedDataToday: new ParsedData(BaselineToday),
              parsedDataNearFuture: nearDataParsed,
            }),
          })
          .subscribe(() => {
            const farDataParsed = new ParsedData(data[1]);
            this.scenarioService
              .cacheNewScenarioInArray({
                ...Object.assign(this.newScenario, {
                  parsedDataFarFuture: farDataParsed,
                }),
              })
              .subscribe(() => {
                setTimeout(() => {
                  // enable the dialog results complete button to allow user to close
                  this.scenarioService.setResultsFromAPIComplete(this.newScenario.scenarioId as string);
                }, 2000);
              });
          });
      });
  }
}
