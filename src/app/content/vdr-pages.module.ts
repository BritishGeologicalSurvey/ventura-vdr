import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from '../app-routing.module';
import { ServicesModule } from '../core/services/services.module';
import { MaterialModule } from '../material.module';
import { ComponentsModule } from '../shared/components/components.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { SignificantFiguresPipe } from '../shared/pipes/significantFigures.pipe';
import { AboutComponent } from './pages/about/about.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { ScenarioPanelComponent } from './pages/scenario-panel/scenario-panel.component';
import { StageDefaultComponent } from './pages/scenario-panel/stage-default/stage-default.component';
import { StageEditComponent } from './pages/scenario-panel/stage-edit/stage-edit.component';
import { StageReviewComponent } from './pages/scenario-panel/stage-review/stage-review.component';
import { StageSelectComponent } from './pages/scenario-panel/stage-select/stage-select.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SystemsThinkingComponent } from './pages/systems-thinking/systems-thinking.component';
import { LayerPanelComponent } from './pages/tabs/pages/map/layer-panel/layer-panel.component';
import { MapComponent } from './pages/tabs/pages/map/map.component';
import { ResultsPanelComponent } from './pages/tabs/pages/map/results-panel/results-panel.component';
import { LayerService } from './pages/tabs/pages/map/services/layer.service';
import { VisualisationService } from './pages/tabs/pages/map/services/visualisation.service';
import { CatchmentsComponent } from './pages/tabs/pages/table/catchments/catchments.component';
import { CatchmentsGroupComponent } from './pages/tabs/pages/table/catchmentsGroup/catchmentsGroup.component';
import { OutletsComponent } from './pages/tabs/pages/table/outlets/outlets.component';
import { SummaryComponent } from './pages/tabs/pages/table/summary/summary.component';
import { TableComponent } from './pages/tabs/pages/table/table.component';
import { TabsComponent } from './pages/tabs/tabs.component';
import { VdrComponent } from './vdr.component';

@NgModule({
  declarations: [
    ProgressComponent,
    TabsComponent,
    ScenarioPanelComponent,
    LayerPanelComponent,
    ResultsPanelComponent,
    MapComponent,
    TableComponent,
    SettingsComponent,
    AboutComponent,
    HelpComponent,
    HomeComponent,
    VdrComponent,
    SummaryComponent,
    CatchmentsComponent,
    OutletsComponent,
    CatchmentsGroupComponent,
    StageDefaultComponent,
    StageSelectComponent,
    StageEditComponent,
    StageReviewComponent,
    SystemsThinkingComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MaterialModule,
    PipesModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule,
    ComponentsModule,
  ],
  exports: [TableComponent],
  providers: [VisualisationService, LayerService, SignificantFiguresPipe],
})
export class VDRPagesModule {}
