import { Component } from '@angular/core';
import { SnackbarService } from 'src/app/shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  constructor(private snackbarService: SnackbarService) {}

  public triggerPositive() {
    this.snackbarService.sendPositive('This is a positive message', 100000);
  }

  public triggerInformative() {
    this.snackbarService.sendInformative('This is a positive message', 100000);
  }

  public triggerNegative() {
    this.snackbarService.sendNegative('This is a positive message', 100000);
  }
}
