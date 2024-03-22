import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';
import { ParsedData } from 'src/app/shared/objects/parsedData';
import { Subcatchments } from 'src/app/shared/objects/subcatchments';
import { environment } from 'src/environments/environment.base';

interface TableField {
  [key: string]: number | string | Record<string, unknown>;
}

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.component.html',
  styleUrls: ['./outlets.component.scss'],
})
export class OutletsComponent implements OnInit {
  constructor(private scenarioService: ScenarioService) {}

  public displayedColumns: string[] = ['catchment', 'today', 'nearFuture', 'farFuture'];
  public dataSource = new MatTableDataSource<TableField>();
  public scenarioDataSource = new MatTableDataSource<TableField>();
  public Subcatchments = Subcatchments;
  public timePeriods: Array<Record<string, unknown>> = [
    {
      name: 'Baseline', id: 'today', checked: true, color: 'primary'
    },
    {
      name: 'Modest change', id: 'nearFuture', checked: true, color: 'primary'
    },
    {
      name: 'Major change', id: 'farFuture', checked: true, color: 'primary'
    },
  ];
  public activeScenario: NewScenario | BaselineScenario = {};
  public waterFlowUnits = environment.waterFlowUnits;
  public excessWaterUnits = environment.excessWaterUnits;
  public waterQualityUnits = environment.waterQualityUnits;
  public component = OutletsComponent;

  private static merge(target: Array<TableField>, source: Array<TableField>, prop: string): TableField[] {
    source.forEach((sourceElement) => {
      const targetElement = target.find((item) => sourceElement[prop] === item[prop]);
      if (targetElement) {
        Object.assign(targetElement, sourceElement);
      } else {
        target.push(sourceElement);
      }
    });
    return target;
  }

  private static transform(rawData: ParsedData | undefined | null, id: string): TableField[] {
    const transformed: TableField[][] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp: any = {};

    if (rawData) {
      Object.keys(rawData).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reduced = rawData[key as keyof typeof rawData].reduce((acc: Array<any>, curr, index) => {
          acc[index] = {
            catchment: index,
          };

          if (!temp[index]) {
            temp[index] = {
              [key]: curr,
            };
          } else {
            temp[index][key] = curr;
          }
          acc[index][id] = temp[index];
          return acc;
        }, []);
        transformed.push(reduced);
      });
      const final = transformed.reduce((acc, curr) => {
        OutletsComponent.merge(acc, curr, 'catchment');
        return acc;
      });
      return final;
    }
    return [];
  }

  private static mapData(activeScenario: NewScenario | BaselineScenario): Array<TableField> {
    const today = activeScenario.parsedDataToday;
    const nearFuture = activeScenario.parsedDataNearFuture;
    const farFuture = activeScenario.parsedDataFarFuture;

    const tableDataToday = OutletsComponent.transform(today, 'today');
    const tableDataNearFuture = OutletsComponent.transform(nearFuture, 'nearFuture');
    const tableDataFarFuture = OutletsComponent.transform(farFuture, 'farFuture');

    const mergeInitial = OutletsComponent.merge(tableDataToday, tableDataNearFuture, 'catchment');
    const mergeFinal = OutletsComponent.merge(mergeInitial, tableDataFarFuture, 'catchment');

    return mergeFinal;
  }

  private static createFilter(): (data: TableField, filter: string) => boolean {
    return (data: TableField, filter: string) => {
      const searchTerms = JSON.parse(filter);
      let isFilterSet = false;

      if (searchTerms.length === 0) {
        return false;
      }

      Object.keys(searchTerms).forEach((col) => {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      });

      const nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          if (searchTerms.length === 0) {
            found = true;
          } else {
            searchTerms.forEach((term: string) => {
              if (data['id'] === term && isFilterSet) {
                found = true;
              }
            });
          }
          return found;
        }
        return true;
      };
      return nameSearch();
    };
  }

  private resetFilters(): void {
    this.timePeriods.forEach((period) => {
      const vPeriod = period;
      vPeriod['checked'] = true;
    });
    this.dataSource.filter = '';
    this.scenarioDataSource.filter = '';
  }

  public ngOnInit(): void {
    this.scenarioService.activeScenarioObservable.subscribe((id: string) => {
      this.scenarioService
        .getScenarioById(id)
        .subscribe((activeScenario: NewScenario | BaselineScenario | undefined) => {
          if (activeScenario) {
            this.resetFilters();
            this.activeScenario = activeScenario;
            const data = OutletsComponent.mapData(activeScenario);

            if (activeScenario.scenarioId === 'business-as-usual') {
              this.dataSource.data = data;
              this.dataSource.filterPredicate = OutletsComponent.createFilter();
            } else {
              this.scenarioDataSource.data = data;
              this.scenarioDataSource.filterPredicate = OutletsComponent.createFilter();
            }
          }
        });
    });
  }

  public static getTableBgColour(id: string): string {
    let bgClass = '';
    switch (true) {
      case id === 'today':
        bgClass = '!bg-blue-100';
        break;
      case id === 'nearFuture':
        bgClass = '!bg-violet-100';
        break;
      case id === 'farFuture':
        bgClass = '!bg-rose-100';
        break;
      default:
        bgClass = '';
    }
    return bgClass;
  }

  public handleSelectTimePeriod(scenario: string): void {
    const filtered = this.timePeriods.filter((period) => period['checked']).map((item) => item['id']);

    if (scenario === 'business-as-usual') {
      this.dataSource.filter = JSON.stringify(filtered);
    } else if (scenario === 'user-scenario') {
      this.scenarioDataSource.filter = JSON.stringify(filtered);
    }
  }
}
