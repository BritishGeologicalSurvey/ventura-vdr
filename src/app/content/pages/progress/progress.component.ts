import {
  AfterViewInit, Component, Input, ViewChild
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ScenarioService } from 'src/app/core/services/scenario.service';

import { Step } from './progress.model';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements AfterViewInit {
  constructor(private scenarioService: ScenarioService) {}

  @ViewChild('stepper') private progressStepper!: MatStepper;

  @Input() public steps: Array<Step> = [];
  @Input() public linear = true;

  public ngAfterViewInit(): void {
    this.scenarioService.setStepperRef(this.progressStepper);
  }
}
