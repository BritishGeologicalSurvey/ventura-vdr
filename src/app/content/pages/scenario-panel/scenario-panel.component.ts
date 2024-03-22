import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';
import { toKebabCase } from 'src/app/shared/utility/format';

import { MapService } from '../tabs/pages/map/services/map.service';

@Component({
  selector: 'app-scenario-panel',
  templateUrl: './scenario-panel.component.html',
  styleUrls: ['./scenario-panel.component.scss'],
})
export class ScenarioPanelComponent implements OnInit {
  constructor(
    private scenarioService: ScenarioService,
    private mapService: MapService,
  ) {}

  public currentStage = '';
  private stepper!: MatStepper;
  private newScenario: NewScenario = {};
  public options: Array<NewScenario | BaselineScenario> = [];
  public noOfCatchments = 0;
  public scenarioTitle? = '';

  private initWatchers(): void {
    this.scenarioService.newScenarioObservable.subscribe((newScenario: NewScenario) => {
      this.newScenario = newScenario;
    });
    this.scenarioService.currentStageObservable.subscribe((currentStage: string) => {
      this.currentStage = currentStage;
    });
    this.scenarioService.noOfCatchmentsObservable.subscribe((noOfCatchments: number) => {
      this.noOfCatchments = noOfCatchments;
    });
    this.scenarioService.activeScenarioObservable.subscribe((id: string) => {
      this.scenarioService.getScenarioById(id).subscribe((value: NewScenario | BaselineScenario | undefined) => {
        if (value) {
          this.scenarioTitle = value.scenarioName;
        }
      });
    });
  }

  public ngOnInit(): void {
    this.scenarioService.getAllScenarios().subscribe((dataArr: unknown) => {
      if (dataArr) {
        const data = JSON.parse(dataArr as string) as Array<NewScenario>;
        this.options = data;
      }
    });
    this.initWatchers();
  }

  public handleDefaultComplete(data: FormGroup): void {
    const vData = data;
    if (vData.value) {
      vData.value.scenarioId = toKebabCase(vData.value.scenarioName);
      this.scenarioTitle = vData.value.scenarioName;

      const scenario = {
        ...vData.value,
        currentGroup: 0,
        currentStage: 'select',
      };
      this.newScenario = scenario;

      this.scenarioService.cacheNewScenarioInArray(this.newScenario).subscribe(() => {
        this.scenarioService.setNewScenario(scenario);
        this.scenarioService.setActiveScenario(vData.value.scenarioId);
        this.scenarioService.setCurrentStage('select');
        this.mapService.setSubcatchmentProperties([]);
      });
    }
  }

  public handleSelectComplete(proceed: boolean): void {
    if (proceed) {
      this.scenarioService.setCurrentStage('edit');
      this.stepper = this.scenarioService.getStepperRef();
      this.stepper.next();
    }
  }

  public handleSelectReset(proceed: boolean): void {
    if (proceed) {
      this.scenarioService.getAllScenarios().subscribe((dataArr: unknown) => {
        if (dataArr) {
          const data = JSON.parse(dataArr as string) as Array<NewScenario>;
          this.options = data;
          this.scenarioService.setNoOfCatchments(0);
          this.scenarioService.removeScenario(this.options, this.newScenario.scenarioId);
          this.scenarioTitle = 'Scenario';
          this.scenarioService.setCurrentStage('');
          this.mapService.resetFilterLayer();
          this.mapService.updateSubcatchmentSelectionSymbology();
          this.stepper = this.scenarioService.getStepperRef();
          this.stepper.reset();
          this.mapService.updatePanelResultsVisibility(true);
          this.scenarioService.setActiveScenario('business-as-usual');
        }
      });
    }
  }

  public handleEditComplete(proceed: boolean): void {
    if (proceed) {
      this.scenarioService.setCurrentStage('review');
      this.stepper = this.scenarioService.getStepperRef();
      this.stepper.next();
    }
  }

  public handleEditReset(proceed: boolean): void {
    if (proceed) {
      this.scenarioService.setNoOfCatchments(0);
      this.mapService.resetFilterLayer();

      this.scenarioService.setCurrentStage('');
      this.stepper = this.scenarioService.getStepperRef();
      this.stepper.reset();

      this.mapService.updatePanelResultsVisibility(true);
    }
  }

  public handleReviewComplete(proceed: boolean): void {
    if (proceed) {
      this.scenarioService.setCurrentStage('');
      this.mapService.resetFilterLayer();
      this.mapService.updatePanelResultsVisibility(true);
      this.mapService.setResetGroupIds();
    }
  }

  public addMoreSubcatchmentGroups(proceed: boolean): void {
    if (proceed) {
      const newGroup = (this.newScenario.currentGroup as number) + 1;

      this.scenarioService
        .cacheNewScenarioInArray({
          ...Object.assign(this.newScenario, {
            currentGroup: newGroup,
          }),
        })
        .subscribe(() => {
          setTimeout(() => {
            this.scenarioService.setCurrentIteration(newGroup);
            this.scenarioService.setCurrentStage('select');
            this.stepper = this.scenarioService.getStepperRef();
            this.stepper.reset();
          }, 100);
        });
    }
  }

  public cancelNewScenario(proceed: boolean): void {
    if (proceed) {
      this.scenarioService.getAllScenarios().subscribe((dataArr: unknown) => {
        if (dataArr) {
          const data = JSON.parse(dataArr as string) as Array<NewScenario>;
          this.options = data;

          this.stepper = this.scenarioService.getStepperRef();
          this.stepper.reset();
          this.scenarioTitle = 'Scenario';
          this.scenarioService.setNoOfCatchments(0);
          this.scenarioService.removeScenario(this.options, this.newScenario.scenarioId);

          this.scenarioService.setShouldResetGroups(true);
          this.mapService.updateResultsTimePeriod(ResultTimePeriod.TODAY);
          this.mapService.updateResultsLayer(ResultType.WATER_FLOW);
          this.mapService.resetFilterLayer();
          this.mapService.updateSubcatchmentSelectionSymbology();
          this.mapService.clearSubcatchments();
          this.mapService.clearSubcatchmentProperties();
          this.mapService.updatePanelResultsVisibility(true);
          this.mapService.setResetGroupIds();
          this.scenarioService.setCurrentStage('');
          this.scenarioService.setCurrentIteration(0);
          this.scenarioService.setActiveScenario('business-as-usual');
        }
      });
    }
  }
}
