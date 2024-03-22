import { Component } from '@angular/core';

export interface SummaryElement {
  blank: string;
  totalArea: number;
  population: number;
  populationNear: number;
  populationFar: number;
}

const population = 113423;
const summaryData: SummaryElement[] = [
  {
    blank: 'today',
    totalArea: 113478,
    population,
    populationNear: Math.round(population * 1.2),
    populationFar: Math.round(population * 1.3),
  },
];

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  public displayedColumns: string[] = ['blank', 'totalArea', 'population', 'populationNear', 'populationFar'];
  public dataSource = summaryData;
}
