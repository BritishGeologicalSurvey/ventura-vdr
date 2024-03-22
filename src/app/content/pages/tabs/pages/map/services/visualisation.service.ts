import { Injectable } from '@angular/core';
import ColorHash from 'color-hash-ts';
import * as L from 'leaflet';
import polylabel from 'polylabel';
import { TemporalLayerVisualisationType } from 'src/app/shared/enums/temporal-layer-visualisation-type.enum';
import { TemporalLayerVisualisationItem } from 'src/app/shared/interfaces/temporal-layer.interface';
import { SubcatchmentProperties } from 'src/app/shared/models/scenario.model';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class VisualisationService {
  constructor(private dataService: DataService) {}

  /**
   * Set scenario visualisation to the default appearance.
   *
   * @returns {void}
   */
  public setBaselineVisualisation(): void {
    if (this.dataService.groupIds) {
      this.dataService.map.removeLayer(this.dataService.groupIds);
    }
    this.dataService.subcatchments.eachFeature((layer) => {
      layer.setStyle({
        fillColor: 'black',
        fillOpacity: 0.3,
      });
    });
  }

  /**
   * Visualise edited subcatchments in the same way as the scenario 'edit' stage.
   *
   * @param {Array<SubcatchmentProperties>} editedSubcatchments Array of properties for edited subcatchments
   * @returns {void}
   */
  public setScenarioVisualisationForEditedSubcatchments(editedSubcatchments: Array<SubcatchmentProperties>): void {
    this.setBaselineVisualisation();

    if (this.dataService.groupIds) {
      this.dataService.map.removeLayer(this.dataService.groupIds);
    }

    const groupMarkerArray: Array<L.Marker> = [];
    editedSubcatchments.forEach((subcatchment: SubcatchmentProperties) => {
      const colourCode = VisualisationService.createColourHex(subcatchment.GROUP_ID.toString());
      this.dataService.subcatchments.setFeatureStyle(subcatchment.OBJECTID, {
        fillColor: colourCode,
        fillOpacity: 0.3,
      });

      const selectedFeature: any = this.dataService.subcatchments.getFeature(subcatchment.OBJECTID);
      // External lib to calculate more precise centre in polygons with Interesting Geometry
      const calculatedTrueCentre = polylabel(selectedFeature.feature.geometry.coordinates, 1.0);
      const polyLabelCentre = L.latLng(calculatedTrueCentre[1], calculatedTrueCentre[0]);
      // Match the group poly colour with darker shade label
      const darkerLabelColour = VisualisationService.createColourHex(subcatchment.GROUP_ID.toString(), 0.3);
      groupMarkerArray.push(
        L.marker(polyLabelCentre, {
          icon: new L.DivIcon({
            html: `
              <div class="flex flex-col h-10 w-10 items-center">
                <span class="text-lg font-aspekta-bold" style="color:${darkerLabelColour}">
                  ${subcatchment.GROUP_ID.toString()}
                </span>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          }),
        }),
      );
    });
    this.dataService.groupIds = new L.LayerGroup(groupMarkerArray);
    this.dataService.map.addLayer(this.dataService.groupIds);
  }

  /**
   * Generate a unique hex colour string.
   *
   * @param {string} text String to convert into hex code
   * @param {number} lightnessValue Opacity value from 0-1
   * @returns {string}
   */
  public static createColourHex(text: string, lightnessValue?: number): string {
    if (lightnessValue) {
      const colorHash = new ColorHash({ lightness: [lightnessValue] });
      return colorHash.hex(text);
    }
    const colorHash = new ColorHash();
    return colorHash.hex(text);
  }

  /**
   * Get colour ramp for population layer.
   *
   * @param value Number value to assign hex colour to
   * @returns {string}
   */
  private static getPopulationColourRamp(value: number): string {
    switch (true) {
      case value <= 1700:
        return '#fff7f3';
      case value > 1700 && value <= 4600:
        return '#fde0dd';
      case value > 4600 && value <= 10000:
        return '#fcc5c0';
      case value > 10000 && value <= 17000:
        return '#fa9fb5';
      case value > 17000 && value <= 29000:
        return '#f768a1';
      case value > 29000 && value <= 60000:
        return '#dd3497';
      case value > 60000 && value <= 107000:
        return '#ae017e';
      case value > 107000 && value <= 163000:
        return '#7a0177';
      default:
        return '#7a0177';
    }
  }

  /**
   * Get colour ramp for impervious area layer.
   *
   * @param value Number value to assign hex colour to
   * @returns {string}
   */
  private static getPropImpervColourRamp(value: number): string {
    switch (true) {
      case value <= 0.2:
        return '#ffffcc';
      case value > 0.2 && value <= 0.3:
        return '#ffeda0';
      case value > 0.3 && value <= 0.4:
        return '#fed976';
      case value > 0.4 && value <= 0.5:
        return '#feb24c';
      case value > 0.5 && value <= 0.6:
        return '#fd8d3c';
      case value > 0.6 && value <= 0.7:
        return '#fc4e2a';
      case value > 0.7 && value <= 0.8:
        return '#e31a1c';
      case value > 0.8 && value <= 0.9:
        return '#b10026';
      default:
        return '#b10026';
    }
  }

  /**
   * Default colour ramp
   *
   * @param value Number value to assign hex colour to
   * @returns {string}
   */
  private static getDefaultColourRamp(value: number): string {
    switch (true) {
      case value <= 0.2:
        return '#ffffe5';
      case value > 0.2 && value <= 0.3:
        return '#f7fcb9';
      case value > 0.3 && value <= 0.4:
        return '#d9f0a3';
      case value > 0.4 && value <= 0.5:
        return '#addd8e';
      case value > 0.5 && value <= 0.6:
        return '#78c679';
      case value > 0.6 && value <= 0.7:
        return '#41ab5d';
      case value > 0.7 && value <= 0.8:
        return '#238443';
      case value > 0.8 && value <= 0.9:
        return '#005a32';
      default:
        return '#005a32';
    }
  }

  /**
   * Get colour ramp for a specified visualisation.
   *
   * @param {TemporalLayerVisualisationType} visualisation Type of layer visualisation
   * @param {number} value Number value to assign hex colour to
   * @returns {string}
   */
  public static getVisualisationColourRamp(visualisation: TemporalLayerVisualisationType, value: number): string {
    if (visualisation === TemporalLayerVisualisationType.POPULATION) {
      return VisualisationService.getPopulationColourRamp(value);
    }
    if (visualisation === TemporalLayerVisualisationType.PROP_IMPERV) {
      return VisualisationService.getPropImpervColourRamp(value);
    }
    return VisualisationService.getDefaultColourRamp(value);
  }

  /**
   * Visualise subcatchments or temporal layers dynamically with colour ramps.
   *
   * @param visualisation Configuration for a specified visualisation
   * @returns {void}
   */
  public setSubcatchmentVisualisation(visualisation: TemporalLayerVisualisationItem): void {
    if (visualisation.display === false) {
      // Switch off choropleth, but check how need to colour up the subcatchments first
      if ('activeSubcatchmentProperties' in this.dataService.scenario) {
        if (this.dataService.scenario.activeSubcatchmentProperties) {
          this.setScenarioVisualisationForEditedSubcatchments(this.dataService.scenario.activeSubcatchmentProperties);
        }
      } else {
        this.setBaselineVisualisation();
      }
    } else {
      this.dataService.subcatchments.eachFeature((layer) => {
        if (visualisation.visualisation === TemporalLayerVisualisationType.POPULATION) {
          layer.setStyle({
            fillColor: VisualisationService.getVisualisationColourRamp(
              visualisation.visualisation,
              layer.feature.properties.Population,
            ),
            fillOpacity: 0.3,
          });
        } else if (visualisation.visualisation === TemporalLayerVisualisationType.PROP_IMPERV) {
          layer.setStyle({
            fillColor: VisualisationService.getVisualisationColourRamp(
              visualisation.visualisation,
              layer.feature.properties.Prop_imper,
            ),
            fillOpacity: 0.3,
          });
        } else {
          layer.setStyle({
            fillColor: VisualisationService.getVisualisationColourRamp(
              visualisation.visualisation,
              layer.feature.properties.Green_Spac,
            ),
            fillOpacity: 0.3,
          });
        }
      });
    }
  }

  /**
   * Set layer style for subcatchments.
   *
   * @param state 'default' or 'selected' state to decide which colour is set
   * @returns {Record<string, unknown>}
   */
  public static setLayerSubcatchmentStyle(state: string): L.PathOptions {
    if (state === 'selected') {
      return { fillColor: 'yellow' };
    }
    return { color: 'black', weight: 2, fillOpacity: 0.3 };
  }
}
