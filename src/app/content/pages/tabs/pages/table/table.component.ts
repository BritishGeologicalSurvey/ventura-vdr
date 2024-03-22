import { Component, Input } from '@angular/core';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() public data!: NewScenario | BaselineScenario;
  public currentStage = '';

  constructor(private scenarioService: ScenarioService) {
    this.scenarioService.currentStageObservable.subscribe((stage: string) => {
      this.currentStage = stage;
    });
  }
}
