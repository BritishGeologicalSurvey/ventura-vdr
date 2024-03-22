import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './content/pages/about/about.component';
import { HelpComponent } from './content/pages/help/help.component';
import { HomeComponent } from './content/pages/home/home.component';
import { SettingsComponent } from './content/pages/settings/settings.component';
import { SystemsThinkingComponent } from './content/pages/systems-thinking/systems-thinking.component';
import { VdrComponent } from './content/vdr.component';
import { AppRoutes } from './routes/routes';

const routes: Routes = [
  {
    path: AppRoutes.HOME.segments,
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: AppRoutes.VDR.segments,
    component: VdrComponent,
  },
  {
    path: AppRoutes.SETTINGS.segments,
    component: SettingsComponent,
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
  },
  {
    path: AppRoutes.ABOUT.segments,
    component: AboutComponent,
  },
  {
    path: AppRoutes.SYSTEMS_THINKING.segments,
    component: SystemsThinkingComponent,
  },
  {
    path: '**',
    redirectTo: AppRoutes.HOME.segments,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
