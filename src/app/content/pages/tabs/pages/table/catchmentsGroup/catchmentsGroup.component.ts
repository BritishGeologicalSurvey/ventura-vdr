import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { NewScenario, ScenarioEditStage } from 'src/app/shared/models/scenario.model';

@Component({
  selector: 'app-catchments-group',
  templateUrl: './catchmentsGroup.component.html',
  styleUrls: ['./catchmentsGroup.component.scss'],
})
export class CatchmentsGroupComponent implements OnInit {
  constructor(private scenarioService: ScenarioService) {}

  public displayedColumns: string[] = [
    'groupId',
    'rcForNewDevelopment',
    'waterDemandForNewDevelopment',
    'retrofitRC',
    'retrofitWaterDemand',
  ];
  public groups: Array<ScenarioEditStage> = [];
  public dataSource = this.groups;

  private initWatchers(): void {
    combineLatest([this.scenarioService.getAllScenarios(), this.scenarioService.activeScenarioObservable]).subscribe(
      ([scenarios, activeScenarioId]) => {
        const parsedScenarios = JSON.parse(scenarios as string);
        if (parsedScenarios) {
          const currentScenario = parsedScenarios.filter(
            (scenario: NewScenario) => scenario.scenarioId === activeScenarioId,
          );
          if (currentScenario.length > 0) {
            if (currentScenario[0].editArray) {
              const mapped = currentScenario[0].editArray.map((item: ScenarioEditStage, index: number) => {
                const vItem = item;
                vItem.groupId = index;
                return item;
              });
              this.dataSource = mapped;
            } else {
              this.dataSource = [];
            }
          }
        }
      },
    );
  }

  public ngOnInit(): void {
    this.initWatchers();
  }
}
