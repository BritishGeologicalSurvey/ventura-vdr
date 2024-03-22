import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackbarComponent } from './snackbar.component';
import { ISnackbar, NotificationType } from './snackbar.interface';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  private openSnackbar(notificationData: ISnackbar): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: notificationData.duration,
      data: {
        title: notificationData.title,
        type: notificationData.type,
      },
      panelClass: ['snackbar', notificationData.panelClass],
    });
  }

  public sendInformative(title: string, duration = 3000): void {
    const notificationData: ISnackbar = {
      type: NotificationType.INFORMATION,
      title,
      duration,
      panelClass: 'snackbar-information',
    };
    this.openSnackbar(notificationData);
  }
  public sendNegative(title: string, duration = 12000): void {
    const notificationData: ISnackbar = {
      type: NotificationType.NEGATIVE,
      title,
      duration,
      panelClass: 'snackbar-negative',
    };
    this.openSnackbar(notificationData);
  }
  public sendPositive(title: string, duration = 3000): void {
    const notificationData: ISnackbar = {
      type: NotificationType.POSITIVE,
      title,
      duration,
      panelClass: 'snackbar-positive',
    };
    this.openSnackbar(notificationData);
  }
}
