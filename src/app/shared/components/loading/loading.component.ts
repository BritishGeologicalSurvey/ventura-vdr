import { Component } from '@angular/core';
import { PageLoadingService } from 'src/app/core/services/pageLoadingService.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  constructor(public pageLoadingService: PageLoadingService) {}
}
