import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { ISnackbar, NotificationType } from './snackbar.interface';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  public notificationType = NotificationType;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: ISnackbar,
    private snackbarRef: MatSnackBarRef<SnackbarComponent>,
  ) {}

  public handleClose() {
    this.snackbarRef.dismiss();
  }
}
