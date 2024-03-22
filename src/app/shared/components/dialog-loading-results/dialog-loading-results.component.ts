import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MapService } from 'src/app/content/pages/tabs/pages/map/services/map.service';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { Swiper } from 'swiper/types';

import { ResultType } from '../../enums/result-type.enum';
import { ResultTimePeriod } from '../../enums/time-period.enum';

@Component({
  selector: 'app-dialog-create-scenario',
  templateUrl: './dialog-loading-results.component.html',
  styleUrls: ['./dialog-loading-results.component.scss'],
})
export class DialogLoadingResultsComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperRef') private swiperRef: ElementRef | undefined;
  private swiper?: Swiper;
  public resultsComplete = false;
  public newScenarioID = '';

  constructor(
    public dialogRef: MatDialogRef<DialogLoadingResultsComponent>,
    private scenarioService: ScenarioService,
    private mapService: MapService,
  ) {}

  public ngOnInit(): void {
    this.initWatchers();
  }

  public ngAfterViewInit(): void {
    this.swiper = this.swiperRef?.nativeElement.swiper;
    const swiperParams = {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 8,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(this.swiperRef?.nativeElement, swiperParams);

    // and now initialize it
    this.swiperRef?.nativeElement.initialize();
  }

  public initWatchers(): void {
    this.scenarioService.resultsFromAPICompleteObs.subscribe((newScenarioID: string) => {
      if (newScenarioID) {
        this.resultsComplete = true;
        this.newScenarioID = newScenarioID;
      }
    });
  }

  public viewResults(): void {
    this.mapService.updateSubcatchmentSelectionSymbology();
    this.scenarioService.setActiveScenario(this.newScenarioID);
    this.mapService.updateResultsTimePeriod(ResultTimePeriod.TODAY);
    this.mapService.updateResultsLayer(ResultType.WATER_FLOW);
    this.scenarioService.setCurrentIteration(0);
    this.mapService.setSubcatchmentProperties([]);
    this.mapService.clearSubcatchments();
    this.mapService.clearSubcatchmentProperties();
    this.scenarioService.setNoOfCatchments(0);
    this.scenarioService.setShouldResetGroups(true);

    this.scenarioService.setCurrentStage('');
    this.mapService.resetFilterLayer();
    this.mapService.updatePanelResultsVisibility(true);
    this.mapService.setResetGroupIds();

    this.dialogRef.close();
  }
}
