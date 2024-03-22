import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public minDate = new Date('2011-11-30');
  public maxDate = new Date('2012-01-30');
  public startDate: Date = new Date();

  constructor(private cdr: ChangeDetectorRef) {}

  public settingsForm: VdrSettings = {
    startDate: new Date('2011-11-30'),
    endDate: new Date('2012-01-30'),
    populationGrowthNearFuture: 20,
    populationGrowthFarFuture: 30,
    rainfallMultiplierNearFuture: 20,
    rainfallMultiplierFarFuture: 50,
  };

  public resetForm(): void {
    this.settingsForm = {
      startDate: new Date('2011-11-30'),
      endDate: new Date('2012-01-30'),
      populationGrowthNearFuture: 20,
      populationGrowthFarFuture: 30,
      rainfallMultiplierNearFuture: 20,
      rainfallMultiplierFarFuture: 50,
    };
  }

  // public log(): void {
  // console.log(this.settingsForm);
  // }
}

export interface VdrSettings {
  startDate: Date;
  endDate: Date;
  populationGrowthNearFuture: number;
  populationGrowthFarFuture: number;
  rainfallMultiplierNearFuture: number;
  rainfallMultiplierFarFuture: number;
}
