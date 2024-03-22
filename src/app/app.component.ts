import { AfterViewInit, Component, OnInit } from '@angular/core';
import { scenarios } from 'src/assets/data/scenario-objs';
import { register } from 'swiper/element/bundle';

import { ScenarioService } from './core/services/scenario.service';
import { AllScenarios } from './shared/models/scenario.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'vdr';
  public loadApp = false;

  constructor(private scenarioService: ScenarioService) {}

  private static initScenarioData(): Array<AllScenarios> {
    const allScenarios: AllScenarios[] = [];
    Object.values(scenarios).forEach((scenario: AllScenarios) => allScenarios.push(scenario));
    return allScenarios;
  }

  public ngOnInit() {
    this.scenarioService.getAllScenarios().subscribe((data: unknown) => {
      if (data == null) {
        const allScenarios = AppComponent.initScenarioData();
        this.scenarioService.cacheAllScenarios(allScenarios).subscribe(() => {
          this.loadApp = true;
        });
      } else {
        this.loadApp = true;
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public ngAfterViewInit(): void {
    register();
  }
}
