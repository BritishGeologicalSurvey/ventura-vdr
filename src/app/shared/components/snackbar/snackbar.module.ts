import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialModule } from 'src/app/material.module';

import { SnackbarComponent } from './snackbar.component';
import { SnackbarService } from './snackbar.service';

@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule, MatSnackBarModule, MaterialModule],
  providers: [
    {
      provide: MatSnackBarRef,
      useValue: {},
    },
    SnackbarService,
  ],
})
export class SnackbarModule {}
