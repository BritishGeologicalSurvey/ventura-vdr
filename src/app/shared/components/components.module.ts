import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from 'src/app/material.module';

import { DialogCreateScenarioComponent } from './dialog-create-scenario/dialog-create-scenario.component';
import { DialogLearnAboutItemComponent } from './dialog-learn-about-item/dialog-learn-about-item.component';
import { DialogLoadingResultsComponent } from './dialog-loading-results/dialog-loading-results.component';
import { DialogPrototypeWarningComponent } from './dialog-prototype-warning/dialog-prototype-warning.component';
import { DialogScenarioInfoComponent } from './dialog-scenario-info/dialog-scenario-info.component';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { LoadingComponent } from './loading/loading.component';
import { SnackbarModule } from './snackbar/snackbar.module';
import { WarningBannerComponent } from './warning-banner/warning-banner.component';

@NgModule({
  declarations: [
    DialogCreateScenarioComponent,
    LoadingComponent,
    DialogLearnAboutItemComponent,
    FormErrorsComponent,
    DialogLoadingResultsComponent,
    WarningBannerComponent,
    DialogPrototypeWarningComponent,
    DialogScenarioInfoComponent,
  ],
  imports: [
    CommonModule,
    SnackbarModule,
    MatDialogModule,
    MaterialModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [LoadingComponent, FormErrorsComponent, WarningBannerComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
