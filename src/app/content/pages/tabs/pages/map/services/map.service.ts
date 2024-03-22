import { Injectable } from '@angular/core';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { ResultsComparisonItem } from 'src/app/shared/enums/default-stage.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { CompoundInformation } from 'src/app/shared/interfaces/compound-information.interface';
import { TemporalLayerVisualisationItem } from 'src/app/shared/interfaces/temporal-layer.interface';
import { SubcatchmentProperties } from 'src/app/shared/models/scenario.model';
import { CompoundList } from 'src/app/shared/objects/compoundList';

import { DataService } from './data.service';

@Injectable()
export class MapService {
  private filterLayer!: L.GeoJSON;
  public layerGroup!: L.LayerGroup;

  private resultsLayerSource = new BehaviorSubject<ResultType>(ResultType.WATER_FLOW);
  public resultsLayerSourceObservable = this.resultsLayerSource.asObservable();

  private resultsTimePeriodSource = new BehaviorSubject<ResultTimePeriod>(ResultTimePeriod.TODAY);
  public resultsTimePeriodSourceObservable = this.resultsTimePeriodSource.asObservable();

  private temporalLayerVisSource = new Subject<TemporalLayerVisualisationItem>();
  public temporalLayerVisObservable = this.temporalLayerVisSource.asObservable();

  private selectedSubcatchments = new BehaviorSubject<Array<number>>([]);
  public selectedSubcatchmentsObs = this.selectedSubcatchments.asObservable();

  private activeSubcatchmentProperties = new BehaviorSubject<Array<SubcatchmentProperties>>([]);
  public activeSubcatchmentPropertiesObs = this.activeSubcatchmentProperties.asObservable();

  private setActiveNutrient = new BehaviorSubject<CompoundInformation>(CompoundList[0]);
  public setActiveNutrientObservable = this.setActiveNutrient.asObservable();

  private panelResultsVisibilitySource = new BehaviorSubject<boolean>(true);
  public panelResultsVisibilityObservable = this.panelResultsVisibilitySource.asObservable();

  private panelTemporalLayersVisibilitySource = new BehaviorSubject<boolean>(true);
  public panelTemporalLayersVisibilityObservable = this.panelTemporalLayersVisibilitySource.asObservable();

  private scenarioResultsComparisonSelectedSource = new Subject<ResultsComparisonItem>();
  public scenarioResultsComparisonSelectedObservable = this.scenarioResultsComparisonSelectedSource.asObservable();

  private displayValueSource = new Subject<number>();
  public displayValueSourceObservable = this.displayValueSource.asObservable();

  private subcatchmentSymbologySource = new Subject<string>();
  public subcatchmentSymbologyObservable = this.subcatchmentSymbologySource.asObservable();

  private resetGroupIds = new Subject<boolean>();
  public resetGroupIdsObs = this.resetGroupIds.asObservable();

  constructor(
    private scenarioService: ScenarioService,
    private dataService: DataService,
  ) {}

  public updateDisplayValueSource(value: number) {
    this.displayValueSource.next(value);
  }

  public watchScenarioComparisonOptionsSelection(): Observable<ResultsComparisonItem> {
    return this.scenarioResultsComparisonSelectedSource.asObservable();
  }

  public updateScenarioComparisonOptionsSelection(selectedComparisonOption: ResultsComparisonItem) {
    this.scenarioResultsComparisonSelectedSource.next(selectedComparisonOption);
  }

  public watchPanelResultsVisibility(): Observable<boolean> {
    return this.panelResultsVisibilitySource.asObservable();
  }

  public updatePanelResultsVisibility(visible: boolean) {
    this.panelResultsVisibilitySource.next(visible);
  }

  public watchTemporalLayerVisualisation(): Observable<TemporalLayerVisualisationItem> {
    return this.temporalLayerVisSource.asObservable();
  }

  public updateTemporalLayerVisualisation(visualisation: TemporalLayerVisualisationItem) {
    this.temporalLayerVisSource.next(visualisation);
  }

  public watchResultsLayer(): Observable<ResultType> {
    return this.resultsLayerSource.asObservable();
  }

  public updateResultsLayer(layerName: ResultType) {
    this.resultsLayerSource.next(layerName);
  }

  public watchResultsTimePeriod(): Observable<ResultTimePeriod> {
    return this.resultsTimePeriodSource.asObservable();
  }

  public updateResultsTimePeriod(timePeriod: ResultTimePeriod) {
    this.resultsTimePeriodSource.next(timePeriod);
  }

  public setFilterLayer(layer: L.GeoJSON): void {
    this.filterLayer = layer;
  }

  public resetFilterLayer(): void {
    if (this.filterLayer) {
      this.dataService.map.removeLayer(this.filterLayer);
      this.dataService.map.closePopup();
    }
  }

  public runFilterQuery(layer: esri.FeatureLayer, queryStr: string): void {
    if (queryStr !== '') {
      layer
        .query()
        .where(queryStr)
        .run((error, featureCollection) => {
          if (error) {
            return;
          }

          const properties = featureCollection.features.map((item: any) => item.properties);
          this.activeSubcatchmentProperties.next(properties);

          const selected = featureCollection.features.map((item: any) => item.properties.VDR_ID);
          this.selectedSubcatchments.next(selected);

          this.scenarioService.setNoOfCatchments(featureCollection.features.length);

          if (this.layerGroup) {
            this.dataService.map.removeLayer(this.layerGroup);
          }

          this.layerGroup = new L.LayerGroup();
          this.layerGroup.addTo(this.dataService.map);

          const layerFiltered = L.geoJson(featureCollection).addTo(this.dataService.map);
          this.layerGroup.addLayer(layerFiltered);
          this.setFilterLayer(layerFiltered);
        });
    } else {
      this.resetFilterLayer();
    }
  }

  public addSubcatchment(subcatchmentId: number): void {
    const newArr = [...this.selectedSubcatchments.getValue(), subcatchmentId];
    this.selectedSubcatchments.next(newArr);
  }

  public removeSubcatchment(subcatchmentId: number): void {
    const current = this.selectedSubcatchments.getValue();
    if (current.length > 1) {
      const filtered = this.selectedSubcatchments.getValue().filter((id) => id !== subcatchmentId);
      this.selectedSubcatchments.next(filtered);
    } else {
      this.selectedSubcatchments.next([]);
    }
  }

  public clearSubcatchments(): void {
    this.selectedSubcatchments.next([]);
  }

  public clearSubcatchmentProperties(): void {
    this.activeSubcatchmentProperties.next([]);
  }

  public setActiveNnutrient(nutrient: CompoundInformation) {
    this.setActiveNutrient.next(nutrient);
  }

  public setSubcatchmentProperties(properties: Array<SubcatchmentProperties>): void {
    this.activeSubcatchmentProperties.next(properties);
  }

  public updateSubcatchmentSelectionSymbology(): void {
    this.subcatchmentSymbologySource.next('');
  }

  public setResetGroupIds(): void {
    this.resetGroupIds.next(true);
  }
}
