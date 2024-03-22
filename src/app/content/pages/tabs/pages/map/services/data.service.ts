import { Injectable } from '@angular/core';
import * as esri from 'esri-leaflet';
import { ResultComparisonType } from 'src/app/shared/enums/comparison-type.enum';
import { DisplayValueOption } from 'src/app/shared/enums/display-type.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { CompoundInformation } from 'src/app/shared/interfaces/compound-information.interface';
import { AllScenarios } from 'src/app/shared/models/scenario.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private leafletMapObj!: L.Map;
  private activeTimePeriod: ResultTimePeriod = ResultTimePeriod.TODAY;
  private activeScenario!: AllScenarios;
  private subcatchmentCentroids!: esri.FeatureLayer;
  private activeResultComparison!: ResultComparisonType | undefined;
  private activeResultType!: ResultType;
  private activeDisplayOption: DisplayValueOption = DisplayValueOption.PERCENT;
  private allScenarios!: Array<AllScenarios>;
  private activeNutrient!: CompoundInformation;
  private layerCentroids!: esri.FeatureLayer;
  private layerOutlets!: esri.FeatureLayer;
  private layerSubcatchmentGroupIDs!: L.LayerGroup;
  private layerSubcatchments!: esri.FeatureLayer;
  private popupOpts: L.PopupOptions = {
    maxWidth: 500,
    className: 'vdr-popup',
  };
  private ids: Array<number> = [];
  private layerWWTP!: esri.FeatureLayer;
  private stage!: string;

  public get map(): L.Map {
    return this.leafletMapObj;
  }

  public set map(map: L.Map) {
    this.leafletMapObj = map;
  }

  public get timePeriod(): ResultTimePeriod {
    return this.activeTimePeriod;
  }

  public set timePeriod(activeTimePeriod: ResultTimePeriod) {
    this.activeTimePeriod = activeTimePeriod;
  }

  public get scenario(): AllScenarios {
    return this.activeScenario;
  }

  public set scenario(activeScenario: AllScenarios) {
    this.activeScenario = activeScenario;
  }

  public get centroids(): esri.FeatureLayer {
    return this.subcatchmentCentroids;
  }

  public set centroids(subcatchmentCentroids: esri.FeatureLayer) {
    this.subcatchmentCentroids = subcatchmentCentroids;
  }

  public get resultComparison(): ResultComparisonType | undefined {
    return this.activeResultComparison;
  }

  public set resultComparison(activeResultComparison: ResultComparisonType | undefined) {
    this.activeResultComparison = activeResultComparison;
  }

  public get resultType(): ResultType {
    return this.activeResultType;
  }

  public set resultType(activeResultType: ResultType) {
    this.activeResultType = activeResultType;
  }

  public get displayOption(): DisplayValueOption {
    return this.activeDisplayOption;
  }

  public set displayOption(activeDisplayOption: DisplayValueOption) {
    this.activeDisplayOption = activeDisplayOption;
  }

  public get scenarios(): Array<AllScenarios> {
    return this.allScenarios;
  }

  public set scenarios(allScenarios: Array<AllScenarios>) {
    this.allScenarios = allScenarios;
  }

  public get nutrient(): CompoundInformation {
    return this.activeNutrient;
  }

  public set nutrient(activeNutrient: CompoundInformation) {
    this.activeNutrient = activeNutrient;
  }

  public get centroidsLayer(): esri.FeatureLayer {
    return this.layerCentroids;
  }

  public set centroidsLayer(layerCentroids: esri.FeatureLayer) {
    this.layerCentroids = layerCentroids;
  }

  public get outletsLayer(): esri.FeatureLayer {
    return this.layerOutlets;
  }

  public set outletsLayer(layerOutlets: esri.FeatureLayer) {
    this.layerOutlets = layerOutlets;
  }

  public get groupIds(): L.LayerGroup<any> {
    return this.layerSubcatchmentGroupIDs;
  }

  public set groupIds(subcatchmentGroupIds: L.LayerGroup<any>) {
    this.layerSubcatchmentGroupIDs = subcatchmentGroupIds;
  }

  public get subcatchments(): esri.FeatureLayer {
    return this.layerSubcatchments;
  }

  public set subcatchments(layerSubcatchments: esri.FeatureLayer) {
    this.layerSubcatchments = layerSubcatchments;
  }

  public get popupOptions(): L.PopupOptions {
    return this.popupOpts;
  }

  public set popupOptions(popupOpts: L.PopupOptions) {
    this.popupOpts = popupOpts;
  }

  public get activeIds(): Array<number> {
    return this.ids;
  }

  public set activeIds(ids: Array<number>) {
    this.ids = ids;
  }

  public get wwtpLayer(): esri.FeatureLayer {
    return this.layerWWTP;
  }

  public set wwtpLayer(layerWWTP: esri.FeatureLayer) {
    this.layerWWTP = layerWWTP;
  }

  public get currentStage(): string {
    return this.stage;
  }

  public set currentStage(stage: string) {
    this.stage = stage;
  }
}
