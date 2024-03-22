import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { SnackbarService } from 'src/app/shared/components/snackbar/snackbar.service';
import { NewScenario, SubcatchmentProperties } from 'src/app/shared/models/scenario.model';

import { MapService } from '../../tabs/pages/map/services/map.service';

@Component({
  selector: 'app-stage-select',
  templateUrl: './stage-select.component.html',
  styleUrls: ['./stage-select.component.scss'],
})
export class StageSelectComponent implements OnInit, OnDestroy {
  constructor(
    private scenarioService: ScenarioService,
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private snackbarService: SnackbarService,
  ) {}

  @Input() public noOfCatchments = 0;
  @Output() public selectComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public selectCancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subscription$!: Subscription;
  public selectForm!: FormGroup;
  public newScenario: NewScenario = {};
  public newScenarioSubcatchmentProperties!: SubcatchmentProperties[];
  public newScenarioIDs!: number[];
  public currentStage!: string;
  public currentGroup!: number;
  public catchmentGroups: Record<number, SubcatchmentProperties[]> = {};

  private initForm(): void {
    this.selectForm = this.formBuilder.group({
      catchmentSize: [0, []],
      population: [0, []],
    });

    this.selectForm.valueChanges.pipe(sampleTime(1000)).subscribe((data: NewScenario['select']) => {
      const vData = data;
      if (vData) {
        vData['catchmentSize'] = String(Number(vData['catchmentSize']) * 1000000);
        this.scenarioService.setNewScenario(
          Object.assign(this.newScenario, {
            currentStage: 'select',
            select: vData,
          }),
        );
      }
    });
  }

  private static groupById(data: Array<SubcatchmentProperties>): Record<number, Array<SubcatchmentProperties>> {
    return data.reduce((group: Record<number, SubcatchmentProperties[]>, subcatchment: SubcatchmentProperties) => {
      const vGroup = group;
      const { GROUP_ID } = subcatchment;
      vGroup[GROUP_ID] = vGroup[GROUP_ID] ?? [];
      vGroup[GROUP_ID].push(subcatchment);
      return vGroup;
    }, {});
  }

  public ngOnInit(): void {
    this.initWatchers();
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public groupsPresent(): boolean {
    return Object.keys(this.catchmentGroups).length > 0;
  }

  public handleContinue(): void {
    if (this.noOfCatchments === 0) {
      this.snackbarService.sendInformative(
        'No subcatchments have been selected. Please select at least one to continue.',
      );
      return;
    }

    this.scenarioService
      .cacheNewScenarioInArray({
        ...Object.assign(this.newScenario, {
          currentStage: 'select',
          select: this.selectForm.value,
          activeSubcatchmentProperties: this.newScenarioSubcatchmentProperties,
          ids: this.newScenarioIDs,
        }),
      })
      .subscribe(() => {
        this.selectComplete.emit(true);
      });
  }

  public cancelNewScenario(): void {
    this.selectCancel.emit(true);
    this.selectForm.reset();
  }

  private initWatchers(): void {
    this.scenarioService.newScenarioObservable.subscribe((newScenario: NewScenario) => {
      this.newScenario = newScenario;
    });
    this.scenarioService.currentStageObservable.subscribe((currentStage: string) => {
      this.currentStage = currentStage;
    });
    this.scenarioService.currentIterationObservable.subscribe((currentGroup: number) => {
      this.currentGroup = currentGroup;
    });
    this.mapService.selectedSubcatchmentsObs.subscribe((ids: Array<number>) => {
      if (this.newScenario) {
        this.newScenarioIDs = ids;
      }
    });
    this.subscription$ = this.mapService.activeSubcatchmentPropertiesObs.subscribe(
      (subcatchmentProperties: Array<SubcatchmentProperties>) => {
        if (subcatchmentProperties.length > 0) {
          if (this.newScenario) {
            this.newScenarioSubcatchmentProperties = subcatchmentProperties;
            this.catchmentGroups = StageSelectComponent.groupById(subcatchmentProperties);
          }
        }
      },
    );
  }
}
