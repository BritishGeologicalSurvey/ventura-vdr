import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SubcatchmentProperties } from 'src/app/shared/models/scenario.model';

@Injectable()
export class TableService {
  private layerSubcatchmentsSource = new BehaviorSubject<Array<SubcatchmentProperties>>([]);
  public layerSubcatchmentsObservable = this.layerSubcatchmentsSource.asObservable();

  public setLayerSubcatchmentsProperties(properties: Array<SubcatchmentProperties>): void {
    this.layerSubcatchmentsSource.next(properties);
  }
}
