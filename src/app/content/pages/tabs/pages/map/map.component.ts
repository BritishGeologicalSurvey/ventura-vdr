import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { ResultComparisonType } from 'src/app/shared/enums/comparison-type.enum';
import { ResultsComparisonItem } from 'src/app/shared/enums/default-stage.enum';
import { DisplayValueOption } from 'src/app/shared/enums/display-type.enum';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { StaticLayerVisualisationType } from 'src/app/shared/enums/static-layer-visualisation-type.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { CompoundInformation } from 'src/app/shared/interfaces/compound-information.interface';
import { AllScenarios, SubcatchmentProperties } from 'src/app/shared/models/scenario.model';
import { SignificantFiguresPipe } from 'src/app/shared/pipes/significantFigures.pipe';
import { MapService } from './services/map.service';
import { VisualisationService } from './services/visualisation.service';
import { TemporalLayerVisualisationItem } from 'src/app/shared/interfaces/temporal-layer.interface';
import { LayerService } from './services/layer.service';
import { DataService } from './services/data.service';
import { InteractionService } from './services/interaction.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [SignificantFiguresPipe],
})
export class MapComponent implements AfterViewInit, OnInit {
  @Input() public set data(scenario: AllScenarios) {
    this.setData(scenario);
  }

  public leafletMapObj!: L.Map;
  public layerSubcatchments!: esri.FeatureLayer;
  public layerWWTP!: esri.FeatureLayer;
  public layerOSRivers!: esri.FeatureLayer;
  public layerLPA!: esri.FeatureLayer;
  public showResultsPanel = true;
  public showTemporalLayersPanel = true;
  public currentStage = '';
  private activeScenario!: AllScenarios;
  private activeResultType = ResultType.WATER_FLOW;
  private activeResultComparison!: ResultComparisonType | undefined;

  constructor(
    private mapService: MapService,
    private scenarioService: ScenarioService,
    private visualisationService: VisualisationService,
    private layerService: LayerService,
    private dataService: DataService,
    private interactionService: InteractionService,
  ) {}

  public ngOnInit(): void {
    this.initWatchers();
  }

  public ngAfterViewInit(): void {
    this.prepareData(); // Setup data and map layers
    const map = this.initMap(); // Build the map using available layers
    this.dataService.map = map;
    this.layerService.setResultsLayer(this.activeResultType);
    this.leafletMapObj.attributionControl.addAttribution(
      `
        Contains OS data © Crown copyright and database rights ${new Date().getFullYear()}
        © Environment Agency copyright and/or database right 2015. All rights reserved.
        Office for National Statistics licensed under the Open Government Licence v.3.0
      `,
    );
  }

  /**
   * Initialise data from API calls into the VDR.
   *
   * @param {AllScenarios} scenario
   * @returns {void}
   */
  private setData(scenario: AllScenarios): void {
    if (scenario != null) {
      this.activeScenario = scenario;
      this.dataService.scenario = this.activeScenario;
      this.layerService.setResultsLayer(this.activeResultType);
      this.layerService.updateOutletLayer(this.currentStage);

      // Recreates layer when data comes back
      if (this.activeScenario.scenarioId === 'business-as-usual') {
        this.activeResultComparison = undefined;
        this.dataService.resultComparison = this.activeResultComparison;
        this.visualisationService.setBaselineVisualisation();
      } else if ('activeSubcatchmentProperties' in this.activeScenario) {
        if (this.activeScenario.activeSubcatchmentProperties) {
          this.visualisationService.setScenarioVisualisationForEditedSubcatchments(
            this.activeScenario.activeSubcatchmentProperties,
          );
        }
      }
    }
  }

  /**
   * Initialise all async subscriptions.
   *
   * @returns {void}
   */
  private initWatchers(): void {
    this.mapService.selectedSubcatchmentsObs.subscribe((ids: Array<number>) => {
      this.interactionService.subcatchmentIds = ids;
    });
    this.mapService.subcatchmentSymbologyObservable.subscribe(() => {
      this.visualisationService.setBaselineVisualisation();
    });
    this.mapService.resetGroupIdsObs.subscribe((shouldReset: boolean) => {
      if (shouldReset) {
        this.layerSubcatchments.eachFeature((layer) => {
          delete layer.feature.properties.GROUP_ID;
        });
      }
    });
    this.scenarioService.currentIterationObservable.subscribe((currentGroup: number) => {
      this.interactionService.currentGroup = currentGroup;
    });
    this.mapService.activeSubcatchmentPropertiesObs.subscribe((scProps: SubcatchmentProperties[]) => {
      this.interactionService.subcatchmentProperties = scProps;
    });
    this.scenarioService.getAllScenarios().subscribe((ls: unknown) => {
      if (ls) {
        const data = JSON.parse(ls as string) as Array<AllScenarios>;
        this.dataService.scenarios = data;
      }
    });
    this.mapService.resultsLayerSourceObservable.subscribe((resultType: ResultType) => {
      // Update results type to display
      this.activeResultType = resultType;
      // Update visualisation
      this.layerService.setResultsLayer(resultType);
      this.dataService.resultType = this.activeResultType;
    });
    this.mapService.panelResultsVisibilityObservable.subscribe((visible: boolean) => {
      this.showResultsPanel = visible;
    });
    this.mapService.panelTemporalLayersVisibilityObservable.subscribe((visible: boolean) => {
      this.showTemporalLayersPanel = visible;
    });
    this.mapService.resultsTimePeriodSourceObservable.subscribe((timePeriod: ResultTimePeriod) => {
      // Update active time
      this.dataService.timePeriod = timePeriod;
      // Update visualisation
      this.layerService.changeTimePeriod();
    });
    this.mapService.temporalLayerVisObservable.subscribe((visualisation: TemporalLayerVisualisationItem) => {
      this.visualisationService.setSubcatchmentVisualisation(visualisation);
    });
    this.mapService.scenarioResultsComparisonSelectedObservable.subscribe((comparisonItem: ResultsComparisonItem) => {
      if (comparisonItem.display) {
        this.activeResultComparison = comparisonItem.comparisonType;
        this.dataService.resultComparison = this.activeResultComparison;
      } else {
        this.activeResultComparison = undefined;
        this.dataService.resultComparison = this.activeResultComparison;
      }
      this.layerService.refreshVisibleData();
    });
    this.mapService.setActiveNutrientObservable.subscribe((value: CompoundInformation) => {
      this.layerService.setResultsLayer(ResultType.WATER_QUALITY);
      this.dataService.nutrient = value;
    });
    this.mapService.displayValueSourceObservable.subscribe((value: DisplayValueOption) => {
      this.dataService.displayOption = value;
      this.layerService.setResultsLayer(this.activeResultType);
    });
    this.scenarioService.currentStageObservable.subscribe((currentStage: string) => {
      // Removes the outlets and exccess water centroids during scenario creation.
      this.layerService.updateOutletLayer(this.currentStage);
      this.currentStage = currentStage;
      this.dataService.currentStage = this.currentStage;
      this.showTemporalLayersPanel = this.currentStage === '';
      this.scenarioService.setTabModeSelectionVisibility(this.currentStage === '');
    });
  }

  /**
   * Initialise map layers.
   *
   * @returns {void}
   */
  private prepareData(): void {
    // Layer: subcatchments
    this.layerSubcatchments = this.layerService.createSubcatchmentsLayer();
    this.dataService.subcatchments = this.layerSubcatchments;

    // Layer: Excess water (centroids)
    this.dataService.centroidsLayer = this.layerService.createCentroidLayer();

    // Layer: Waste water treatment plants
    this.layerWWTP = this.layerService.createWWTPLayer();
    this.dataService.wwtpLayer = this.layerWWTP;

    // Layer: OS Open Rivers
    this.layerOSRivers = this.layerService.createRiversLayer();

    // Layer: Local Planning Authorities
    this.layerLPA = this.layerService.createLPALayer();
  }

  /**
   * Initialise Leaflet map.
   *
   * @returns {L.Map}
   */
  private initMap(): L.Map {
    const basemapLayerOSM = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      className: 'tile-layer',
    });

    const map = L.map('map', {
      layers: [basemapLayerOSM],
      center: [53.390766, -2.140179],
      zoom: 10,
      attributionControl: true,
      preferCanvas: true,
      zoomAnimation: true,
      fadeAnimation: false,
      markerZoomAnimation: false,
    });
    this.leafletMapObj = map;
    this.dataService.map = this.leafletMapObj;
    // Add layers to be visible on launch
    this.layerSubcatchments.addTo(map);
    setTimeout(map.invalidateSize.bind(this.leafletMapObj));
    return map;
  }

  /**
   * Toggle static layers from floating list.
   *
   * @param {string} layer Layer name
   * @returns {void}
   */
  public handleStaticLayerChange(layer: string): void {
    switch (layer) {
      case StaticLayerVisualisationType.SUBCATCHMENTS:
        this.layerService.toggleLayer(this.layerSubcatchments);
        break;
      case StaticLayerVisualisationType.RIVERS:
        this.layerService.toggleLayer(this.layerOSRivers);
        break;
      case StaticLayerVisualisationType.LPAS:
        this.layerService.toggleLayer(this.layerLPA);
        break;
      case StaticLayerVisualisationType.WWTP:
        this.layerService.toggleLayer(this.layerWWTP);
        break;
    }
  }
}
