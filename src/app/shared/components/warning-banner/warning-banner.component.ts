import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.base';

import { DialogPrototypeWarningComponent } from '../dialog-prototype-warning/dialog-prototype-warning.component';

@Component({
  selector: 'app-warning-banner',
  templateUrl: './warning-banner.component.html',
  styleUrls: ['./warning-banner.component.scss'],
})
export class WarningBannerComponent {
  public version = environment.version;
  constructor(public dialog: MatDialog) {}

  public handleClick(): void {
    this.dialog.open(DialogPrototypeWarningComponent, {
      maxWidth: '50vw',
      panelClass: 'prototype-warning',
    });
  }
}
