import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  map, Observable, Subject, takeUntil
} from 'rxjs';

import { ScenarioService } from '../core/services/scenario.service';
import { BaselineScenario, NewScenario } from '../shared/models/scenario.model';
import { Step } from './pages/progress/progress.model';

@Component({
  selector: 'app-vdr',
  templateUrl: './vdr.component.html',
  styleUrls: ['./vdr.component.scss'],
})
export class VdrComponent implements OnInit, OnDestroy {
  private $stop = new Subject<void>();
  public data!: NewScenario | BaselineScenario;
  public $scenario!: Observable<NewScenario>;
  public currentStage!: string;
  public progressSteps: Array<Step> = [
    {
      label: 'Select subcatchments',
    },
    {
      label: 'Edit',
    },
    {
      label: 'Review',
    },
  ];
  public showVDR = false;
  public vdrComponent = VdrComponent;

  constructor(public scenarioService: ScenarioService) {}

  private initWatchers(): void {
    this.$scenario = this.scenarioService.newScenarioObservable;
    this.scenarioService.currentStageObservable.pipe(takeUntil(this.$stop)).subscribe((currentStage: string) => {
      this.currentStage = currentStage;
    });
    this.scenarioService
      .getAllScenarios()
      .pipe(
        takeUntil(this.$stop),
        map((data) => {
          if (data) {
            const allScenarios = JSON.parse(data as string) as Array<NewScenario | BaselineScenario>;
            const baseline = allScenarios.find(
              (scenario: NewScenario | BaselineScenario) => scenario.scenarioId === 'business-as-usual',
            );
            return baseline;
          }
          return undefined;
        }),
      )
      .subscribe((baseline: unknown) => {
        this.data = baseline as BaselineScenario;
      });
    this.scenarioService.activeScenarioObservable.subscribe((scenarioId: string) => {
      this.scenarioService
        .getScenarioById(scenarioId)
        .pipe(takeUntil(this.$stop))
        .subscribe((value: NewScenario | BaselineScenario | undefined) => {
          if (value) {
            this.data = value;
          }
        });
    });
  }

  public static showProgressBar(scenario: NewScenario | null): boolean {
    if (scenario == null || Object.keys(scenario).length === 0) {
      return false;
    }
    return true;
  }

  public ngOnInit(): void {
    this.initWatchers();
  }

  public ngOnDestroy(): void {
    this.$stop.next();
    this.$stop.complete();
  }
}
