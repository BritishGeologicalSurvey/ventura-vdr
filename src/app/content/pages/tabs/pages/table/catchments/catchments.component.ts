/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { SubcatchmentProperties } from 'src/app/shared/models/scenario.model';

import { TableService } from '../table.service';

@Component({
  selector: 'app-catchments',
  templateUrl: './catchments.component.html',
  styleUrls: ['./catchments.component.scss'],
})
export class CatchmentsComponent implements OnInit {
  public subcatchmentProperties: Array<SubcatchmentProperties> = [];
  public displayedColumns: string[] = [
    'WB_NAME',
    'Shape__Area',
    'Prop_imper',
    'Green_Spac',
    'Population',
    'Near_term_',
    'Far_term_d',
    'Water_dema',
  ];
  public sortedData!: SubcatchmentProperties[];
  public component = CatchmentsComponent;

  constructor(private tableService: TableService) {}

  public ngOnInit(): void {
    this.tableService.layerSubcatchmentsObservable.subscribe((subcatchmentProperties: SubcatchmentProperties[]) => {
      this.subcatchmentProperties = [...subcatchmentProperties].sort((a, b) => {
        let returnVal;
        if (a.WB_NAME > b.WB_NAME) {
          returnVal = 1;
        } else if (b.WB_NAME > a.WB_NAME) {
          returnVal = -1;
        } else {
          returnVal = 0;
        }
        return returnVal;
      });
      this.sortedData = this.subcatchmentProperties.slice();
    });
  }

  public sortData(sort: Sort) {
    const data = this.subcatchmentProperties.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = [...data].sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'WB_NAME':
          return CatchmentsComponent.compare(a.WB_NAME, b.WB_NAME, isAsc);
        case 'Prop_imper':
          return CatchmentsComponent.compare(a.Prop_imper, b.Prop_imper, isAsc);
        case 'Green_Spac':
          return CatchmentsComponent.compare(a.Green_Spac, b.Green_Spac, isAsc);
        case 'Population':
          return CatchmentsComponent.compare(a.Population, b.Population, isAsc);
        case 'Near_term_':
          return CatchmentsComponent.compare(a.Near_term_, b.Near_term_, isAsc);
        case 'Far_term_d':
          return CatchmentsComponent.compare(a.Far_term_d, b.Far_term_d, isAsc);
        case 'Water_dema':
          return CatchmentsComponent.compare(a.Water_dema, b.Water_dema, isAsc);
        case 'Shape__Area':
          return CatchmentsComponent.compare(a.Shape__Area, b.Shape__Area, isAsc);
        default:
          return 0;
      }
    });
  }

  public static compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public static round(value: number): number {
    return Math.round(value);
  }
}
