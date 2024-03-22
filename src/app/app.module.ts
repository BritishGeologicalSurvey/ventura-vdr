import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MapService } from './content/pages/tabs/pages/map/services/map.service';
import { VDRPagesModule } from './content/vdr-pages.module';
import { CoreModule } from './core/core.module';
import { ServicesModule } from './core/services/services.module';
import { MaterialModule } from './material.module';
import { ComponentsModule } from './shared/components/components.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ComponentsModule,
    CoreModule,
    VDRPagesModule,
    ServicesModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, MapService],
  bootstrap: [AppComponent],
})
export class AppModule {}
