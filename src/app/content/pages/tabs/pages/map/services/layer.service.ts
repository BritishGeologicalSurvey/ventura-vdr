import { Injectable } from '@angular/core';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import { ResultType } from 'src/app/shared/enums/result-type.enum';
import { SubcatchmentProperties } from 'src/app/shared/models/scenario.model';
import { VDRGeoJsonFeature } from 'src/app/shared/objects/GEOJSONfeatureVDR.interface';
import { LayerHelperVDR } from 'src/app/shared/utility/layerHelperVDR';

import { TableService } from '../../table/table.service';
import { DataService } from './data.service';
import { InteractionService } from './interaction.service';
import { LabelDataService } from './label/label-data.service';
import { LabelPresentationService } from './label/label-presentation.service';
import { PopupService } from './popup.service';
import { VisualisationService } from './visualisation.service';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  constructor(
    private dataService: DataService,
    private popupService: PopupService,
    private labelDataService: LabelDataService,
    private labelPresentationService: LabelPresentationService,
    private interactionService: InteractionService,
    private tableService: TableService,
  ) {}

  private readonly CENTROIDS_FEATURE_LAYER =
    'https://services3.arcgis.com/7bJVHfju2RXdGZa4/arcgis/rest/services/ventura_subcatchment_centroids/FeatureServer/0';
  private readonly OUTLETS_FEATURE_LAYER =
    'https://services3.arcgis.com/7bJVHfju2RXdGZa4/arcgis/rest/services/ventura_outlets/FeatureServer/0';
  private readonly SUBCATCHMENT_FEATURE_LAYER =
    'https://services3.arcgis.com/7bJVHfju2RXdGZa4/arcgis/rest/services/ventura_subcatchment/FeatureServer/0';
  private readonly RIVERS_FEATURE_LAYER =
    'https://services.arcgis.com/qHLhLQrcvEnxjtPr/arcgis/rest/services/OS_OpenRivers/FeatureServer/0';
  private readonly LPA_FEATURE_LAYER =
    'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Planning_Authorities_April_2022_UK_BUC_2022/FeatureServer/0';

  /**
   * Set the active results layer on the map.
   *
   * @param layerToDisplay Result type to display from: water flow, excess water or water quality
   * @returns {void}
   */
  public setResultsLayer(layerToDisplay: ResultType): void {
    if (this.dataService.map != null && this.dataService.scenario != null) {
      if (layerToDisplay === ResultType.EXCESS_WATER) {
        this.dataService.map.removeLayer(this.dataService.outletsLayer);
        this.dataService.centroidsLayer = this.createCentroidLayer();
        this.dataService.map.addLayer(this.dataService.centroidsLayer);
      } else {
        this.dataService.map.removeLayer(this.dataService.centroidsLayer);
        const layerOutlets = this.createOutletsLayer();
        this.dataService.outletsLayer = layerOutlets;
        this.dataService.map.addLayer(layerOutlets);
      }
    }
  }

  /**
   * Create layer for centroids.
   *
   * @returns {esri.FeatureLayer}
   */
  public createCentroidLayer(): esri.FeatureLayer {
    if (this.dataService.centroidsLayer != null) {
      this.dataService.map.removeLayer(this.dataService.centroidsLayer);
    }
    const centroids = esri.featureLayer({
      url: this.CENTROIDS_FEATURE_LAYER,
      pointToLayer: (feature: VDRGeoJsonFeature, latLng) => {
        this.popupService.createExcessWaterPopupDetails();
        if (this.dataService.resultComparison) {
          const changeLabel = this.labelPresentationService.createDiffMarkerFinalLabel(
            feature.properties.VDR_ID,
            this.popupService.createWaterFlowPopupDetails.bind(this),
            this.popupService.createWaterQualityPopupDetails.bind(this),
          );
          return L.marker(latLng, {
            icon: new L.DivIcon({
              html: `
                <div class="flex flex-col h-20 w-20 items-center bg-transparent font-mono">
                  <div class="bg-white rounded p-1 text-center change-label-panel">
                    <div class="change-difference-text ${changeLabel.changeTextColour}">
                      ${changeLabel.finalLabel}
                    </div>
                  </div>
                  <img class="h-7 !w-7" src="../../../../../../assets/icons/${changeLabel.changeIcon}"/>
                </div>
              `,
              iconSize: [80, 80],
              iconAnchor: [40, 40],
            }),
          });
        }
        const label = this.labelDataService.getExcessWaterLabel(feature.properties.VDR_ID);
        return L.marker(latLng, {
          icon: new L.DivIcon({
            html: `
              <div class="flex flex-col h-20 w-20 items-center">
                <span class="bg-white rounded p-1">${label}</span>
                <img class="h-7 !w-7" src="../../../../../../assets/icons/centroid.svg"/>
              </div>
            `,
            iconSize: [80, 80],
            iconAnchor: [40, 40],
          }),
        });
      },
    });
    return centroids;
  }

  /**
   * Create layer for outlets.
   *
   * @returns {esri.FeatureLayer}
   */
  public createOutletsLayer(): esri.FeatureLayer {
    if (this.dataService.outletsLayer != null) {
      this.dataService.map.removeLayer(this.dataService.outletsLayer);
    }

    const layerOutlets = esri.featureLayer({
      url: this.OUTLETS_FEATURE_LAYER,
      pointToLayer: (feature: VDRGeoJsonFeature, latLng) => {
        if (this.dataService.resultComparison) {
          const changeLabel = this.labelPresentationService.createDiffMarkerFinalLabel(
            feature.properties.VDR_ID,
            this.popupService.createWaterFlowPopupDetails.bind(this),
            this.popupService.createWaterQualityPopupDetails.bind(this),
          );
          return L.marker(latLng, {
            icon: new L.DivIcon({
              html: `
                <div class="flex flex-col h-20 w-20 items-center bg-transparent font-mono">
                  <div class="bg-white rounded p-1 text-center change-label-panel">
                    <div class="change-difference-text ${changeLabel.changeTextColour}">
                      ${changeLabel.finalLabel}
                    </div>
                  </div>
                  <img class="h-7 !w-7" src="../../../../../../assets/icons/${changeLabel.changeIcon}" />
                </div>
              `,
              iconSize: [80, 80],
              iconAnchor: [40, 40],
            }),
          });
        }
        let label = '';
        if (this.dataService.resultType === ResultType.WATER_FLOW) {
          label = this.labelDataService.getManRiverFlowLabel(feature.properties.VDR_ID);
          this.popupService.createWaterFlowPopupDetails();
        } else if (this.dataService.resultType === ResultType.WATER_QUALITY) {
          this.popupService.createWaterQualityPopupDetails();
          label = this.labelDataService.getWaterQualityLabel(feature.properties.VDR_ID);
        }
        return L.marker(latLng, {
          icon: new L.DivIcon({
            html: `
              <div class="flex flex-col h-20 w-20 items-center bg-transparent font-mono">
                <span class="bg-white rounded p-1 font-aspekta-semibold text-center">${label}</span>
                <img class="h-7 !w-7" src="../../../../../../assets/icons/outlet.svg" />
              </div>
            `,
            iconSize: [80, 80],
            iconAnchor: [40, 40],
          }),
        });
      },
    });
    return layerOutlets;
  }

  /**
   * Create waste water treatment plant layer.
   *
   * @returns {esri.FeatureLayer}
   */
  public createWWTPLayer(): esri.FeatureLayer {
    if (this.dataService.wwtpLayer != null) {
      this.dataService.map.removeLayer(this.dataService.wwtpLayer);
    }
    const layer = esri.featureLayer({
      url: 'https://services3.arcgis.com/7bJVHfju2RXdGZa4/arcgis/rest/services/ventura_wwtp/FeatureServer/0',
      pointToLayer: (feature: VDRGeoJsonFeature, latLng) => {
        this.popupService.createWWTPPopupDetails();
        return L.marker(latLng, {
          icon: new L.DivIcon({
            html: `
              <div class="flex flex-col h-20 w-20 items-center">
                <img class="h-7 !w-7" src="../../../../../../assets/icons/wwtp.svg" />
              </div>
            `,
            iconSize: [80, 80],
            iconAnchor: [40, 40],
          }),
        });
      },
    });
    return layer;
  }

  /**
   * Create subcatchments layer.
   *
   * @returns {esri.FeatureLayer}
   */
  public createSubcatchmentsLayer(): esri.FeatureLayer {
    const subcatchmentLayer = esri
      .featureLayer({
        url: this.SUBCATCHMENT_FEATURE_LAYER,
        style: () => VisualisationService.setLayerSubcatchmentStyle('default'),
      })
      .on('click', (e: any) => {
        // ID used by Leaflet to locate the feature
        const objectId = Number(e.layer.feature.properties.OBJECTID);
        // ID used by the API/WSI-MOD to refer to a specific subcatchment ID
        const vdrId = Number(e.layer.feature.properties.VDR_ID);
        this.interactionService.handleMapClickLogic(objectId, vdrId);
      });

    const getResult = (layer: LayerHelperVDR): string => {
      const popupTemplateSubcatchment = `
        <h2 class="border-b border-bgs-primary-stone">Subcatchment</h2>
        <p class="text-base !mt-0 !mb-2">${layer.feature.properties.WB_NAME}</p>
        <table class="table-auto w-full px-3">
          <thead>
            <tr>
              <th class="border-b-2 border-gray-200 uppercase p-2">Attribute</th>
              <th class="border-b-2 border-gray-200 uppercase p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border-b text-left">ID</td>
              <td class="p-2 border-b text-left">{VDR_ID}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Population</td>
              <td class="p-2 border-b text-left">${Math.round(layer.feature.properties.Population)}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Proportion Impervious</td>
              <td class="p-2 border-b text-left">{Prop_imper}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Green Space</td>
              <td class="p-2 border-b text-left">{Green_Spac}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Area</td><td class="p-2 border-b text-left">
                ${Math.round(layer.feature.properties.Shape__Area / 1000000)} km<sup>2</sup>
              </td>
            </tr>
          </tbody>
        </table>
      `;
      return popupTemplateSubcatchment;
    };

    subcatchmentLayer
      .bindPopup((layer: L.Layer) => {
        const layerVDR = layer as LayerHelperVDR;
        return L.Util.template(getResult(layerVDR), layerVDR.feature.properties);
      }, this.dataService.popupOptions)
      .on('click', (e) => {
        if (this.dataService.activeIds.length === 0 && subcatchmentLayer.isPopupOpen()) {
          // Allow user to view subcatchment information in edit stage
          if (this.dataService.currentStage === 'edit') return;
          e.target.closePopup();
        }
      })
      .on('popupclose', () => {
        if (this.dataService.activeIds.length !== 0) {
          this.dataService.activeIds = [];
        }
      });

    const layerSubcatchmentsTableAttributes: Array<SubcatchmentProperties> = [];
    subcatchmentLayer.on('load', () => {
      if (layerSubcatchmentsTableAttributes.length === 0) {
        // Only on initial load get the attributes and store for access by Table service
        subcatchmentLayer.eachFeature((layer) => {
          layerSubcatchmentsTableAttributes.push(layer.feature.properties);
        });
        this.tableService.setLayerSubcatchmentsProperties(layerSubcatchmentsTableAttributes);
      }
    });
    return subcatchmentLayer;
  }

  /**
   * Create rivers layer.
   *
   * @returns {esri.FeatureLayer}
   */
  public createRiversLayer(): esri.FeatureLayer {
    const layer = esri.featureLayer({
      url: this.RIVERS_FEATURE_LAYER,
      style: () => ({
        fillColor: 'red',
        color: 'blue',
        weight: 2,
        fillOpacity: 0,
      }),
    });
    return layer;
  }

  /**
   * Create local planning authorities layer.
   *
   * @returns {esri.FeatureLayer}
   */
  public createLPALayer(): esri.FeatureLayer {
    const lpaLayer = esri.featureLayer({
      url: this.LPA_FEATURE_LAYER,
      style: () => ({
        fillColor: 'purple',
        color: 'purple',
        weight: 2,
        fillOpacity: 0.2,
      }),
    });
    lpaLayer.on('load', () => {
      lpaLayer.eachFeature((layer: L.FeatureGroup) => {
        layer.bringToBack();
      });
    });
    const popupTemplateLPA = `
      <h2 class="border-b border-bgs-primary-stone">Local Planning Authority</h2>
      <h2>{LPA22NM}</h2>
    `;
    lpaLayer.bindPopup((layer: L.Layer) => {
      const layerVDR = layer as LayerHelperVDR;
      return L.Util.template(popupTemplateLPA, layerVDR.feature.properties);
    }, this.dataService.popupOptions);
    return lpaLayer;
  }

  /**
   * Add or remove a layer from the map.
   *
   * @param {esri.FeatureLayer} layer
   * @returns {void}
   */
  public toggleLayer(layer: esri.FeatureLayer): void {
    if (this.dataService.map.hasLayer(layer)) {
      this.dataService.map.removeLayer(layer);
    } else {
      this.dataService.map.addLayer(layer);
    }
  }

  /**
   * Remove outlets and centroids when user is creating a scenario.
   *
   * @param currentStage The current stage of the scenario
   * @returns {void}
   */
  public updateOutletLayer(currentStage: string): void {
    if (currentStage !== '') {
      this.dataService.map.removeLayer(this.dataService.outletsLayer);
      this.dataService.map.removeLayer(this.dataService.centroidsLayer);
    }
  }

  /**
   * Remove outlets and centroids when user is viewing change predictions for a scenario.
   *
   * @returns {void}
   */
  public changeTimePeriod(): void {
    if (this.dataService.map != null && this.dataService.scenario != null) {
      if (this.dataService.resultType !== ResultType.EXCESS_WATER) {
        if (this.dataService.centroidsLayer) {
          this.dataService.map.removeLayer(this.dataService.centroidsLayer);
        }
        this.dataService.outletsLayer = this.createOutletsLayer();
        this.dataService.map.addLayer(this.dataService.outletsLayer);
      } else {
        if (this.dataService.outletsLayer) {
          this.dataService.map.removeLayer(this.dataService.outletsLayer);
        }
        this.dataService.centroidsLayer = this.createCentroidLayer();
        this.dataService.map.addLayer(this.dataService.centroidsLayer);
      }
    }
  }

  /**
   * Sometimes the visible data doesnt match the currently selected options/inputs,
   * manually trigger an update on demand
   *
   * @returns {void}
   */
  public refreshVisibleData(): void {
    this.setResultsLayer(this.dataService.resultType);
  }
}
