import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MapService } from 'src/app/content/pages/tabs/pages/map/services/map.service';
import { TableService } from 'src/app/content/pages/tabs/pages/table/table.service';

import { LocalStoragePersister } from './persisters/localStoragePersister';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [LocalStoragePersister, MapService, TableService],
})
export class ServicesModule {
  public static forRoot(): ModuleWithProviders<ServicesModule> {
    return {
      ngModule: ServicesModule,
      providers: [LocalStoragePersister, MapService],
    };
  }
}
