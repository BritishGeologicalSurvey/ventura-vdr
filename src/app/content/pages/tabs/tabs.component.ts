import { Component, Input, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';

import { TabsService } from '../services/tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() public data!: NewScenario | BaselineScenario;
  public showTabSelection = true;
  constructor(public tabsService: TabsService, private scenarioService: ScenarioService) {}

  public ngOnInit(): void {
    this.initWatchers();
  }

  public initWatchers(): void {
    this.scenarioService.tabModeSelectionVisibilityObservable.subscribe((tabSelectVisible: boolean) => {
      this.showTabSelection = tabSelectVisible;
    });
  }

  public handleTabChange(event: MatButtonToggleChange): void {
    this.tabsService.setActiveTabView(event.value);
  }
}
