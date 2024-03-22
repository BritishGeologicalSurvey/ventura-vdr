import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import polylabel from 'polylabel';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import { SnackbarService } from 'src/app/shared/components/snackbar/snackbar.service';
import { SubcatchmentProperties } from 'src/app/shared/models/scenario.model';

import { DataService } from './data.service';
import { MapService } from './map.service';
import { VisualisationService } from './visualisation.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  constructor(
    private dataService: DataService,
    private snackbarService: SnackbarService,
    private mapService: MapService,
    private scenarioService: ScenarioService,
  ) {}

  private subcatchmentProps!: Array<SubcatchmentProperties>;
  private group!: number;
  private ids!: Array<number>;

  public get subcatchmentProperties(): Array<SubcatchmentProperties> {
    return this.subcatchmentProps;
  }

  public set subcatchmentProperties(subcatchmentProps: Array<SubcatchmentProperties>) {
    this.subcatchmentProps = subcatchmentProps;
  }

  public get currentGroup(): number {
    return this.group;
  }

  public set currentGroup(group: number) {
    this.group = group;
  }

  public get subcatchmentIds(): Array<number> {
    return this.ids;
  }

  public set subcatchmentIds(ids: Array<number>) {
    this.ids = ids;
  }

  /**
   * Select a subcatchment when in 'default' stage of the VDR.
   *
   * @param {number} objectId ID used by Leaflet to locate the feature
   */
  public handleMapDefaultSelection(objectId: number): void {
    this.dataService.activeIds.forEach((id: number) => {
      this.dataService.subcatchments.setFeatureStyle(id, { fillColor: 'black' });
    });

    this.dataService.activeIds = this.dataService.activeIds.filter((id) => id === objectId);

    if (!this.dataService.activeIds.includes(objectId)) {
      // User clicked on a new subcatchment
      this.dataService.activeIds.push(objectId);
    } else {
      // User clicked on current subcatchment
      this.dataService.activeIds = [];
    }
  }

  /**
   * Select groups of subcatchments when in the 'edit' stage of the VDR.
   *
   * @param objectId ID used by leaflet to locate the feature
   * @param vdrId ID used by the API/WSI-MOD to refer to a specific subcatchment ID
   * @returns {void}
   */
  public handleMapScenarioSelection(objectId: number, vdrId: number): void {
    // Check to see if the user is trying to select a previously selected subcatchment in a previous group
    const selectedSubcatchmentsInPreviousGroups = this.subcatchmentProperties
      .filter((subcatchment: SubcatchmentProperties) => subcatchment.GROUP_ID !== this.currentGroup)
      .map((item) => item.OBJECTID);

    if (selectedSubcatchmentsInPreviousGroups.includes(objectId)) {
      this.snackbarService.sendInformative('Please select a subcatchment which has not already been selected', 3000);
      return;
    }

    const subcatchmentPropertyIds = this.subcatchmentProperties.map((item) => item.OBJECTID);

    if (!this.subcatchmentIds.includes(vdrId)) {
      this.mapService.addSubcatchment(vdrId);
    } else {
      this.mapService.removeSubcatchment(vdrId);

      if (subcatchmentPropertyIds.length > 1) {
        const filtered = this.subcatchmentProperties.filter(
          (subcatchment: SubcatchmentProperties) => subcatchment.OBJECTID !== objectId,
        );
        this.mapService.setSubcatchmentProperties(filtered);
      } else {
        this.mapService.setSubcatchmentProperties([]);
      }

      // Deselecting existing subcatchment and remove the group id label
      this.dataService.subcatchments.setFeatureStyle(objectId, { fillColor: 'black', fillOpacity: 0.3 });
      this.dataService.groupIds.eachLayer((layer: any) => {
        if (Number(layer.options.title) === objectId) {
          this.dataService.groupIds.removeLayer(layer);
        }
      });
    }
    this.visualiseSelectedSubcatchments(subcatchmentPropertyIds);
    this.mapService.setSubcatchmentProperties(this.subcatchmentProperties);
  }

  /**
   * Visualise selected subcatchment groups with dynamic colour values.
   *
   * @param propertyIds Array of subcatchment property IDs
   * @returns {void}
   */
  private visualiseSelectedSubcatchments(propertyIds: Array<number>): void {
    /**
     * Group ID is being cached as the value from the previous scenario,
     * so when clicking on same catchment, it is setting color to group ID 1 colour.
     * It needs to be reset.
     */
    this.dataService.subcatchments.eachFeature((layer) => {
      if (
        this.subcatchmentIds.includes(layer.feature.properties.VDR_ID) &&
        !propertyIds.includes(layer.feature.properties.OBJECTID)
      ) {
        this.subcatchmentProperties.push(layer.feature.properties);
        this.subcatchmentProperties.filter(
          (subCatchProp: SubcatchmentProperties) => subCatchProp.GROUP_ID === this.currentGroup,
        );

        const groupMarkerArray: Array<L.Marker> = [];
        if (this.dataService.groupIds) {
          this.dataService.map.removeLayer(this.dataService.groupIds);
        }
        // loop through all the currently selected subcatchments
        this.subcatchmentProperties.forEach((catchment: SubcatchmentProperties) => {
          const vCatchment = catchment;
          if (typeof vCatchment.GROUP_ID === 'undefined') {
            vCatchment.GROUP_ID = this.currentGroup;
          }

          // generate a colour from the Group ID as a string.
          const colourCode = VisualisationService.createColourHex(vCatchment.GROUP_ID.toString());
          this.dataService.subcatchments.setFeatureStyle(vCatchment.OBJECTID, {
            fillColor: colourCode,
            fillOpacity: 0.3,
          });

          // Group ID labels
          const selectedFeature: any = this.dataService.subcatchments.getFeature(vCatchment.OBJECTID);
          const calculatedTrueCentre = polylabel(selectedFeature.feature.geometry.coordinates, 1.0);
          const polyLabelCentre = L.latLng(calculatedTrueCentre[1], calculatedTrueCentre[0]);
          // Match the group poly colour with darker shade label
          const darkerLabelColour = VisualisationService.createColourHex(vCatchment.GROUP_ID.toString(), 0.3);
          groupMarkerArray.push(
            L.marker(polyLabelCentre, {
              icon: new L.DivIcon({
                html: `
                  <div class="flex flex-col h-10 w-10 items-center">
                    <span class="text-lg font-aspekta-bold" style="color:${darkerLabelColour}">
                      ${vCatchment.GROUP_ID.toString()}
                    </span>
                  </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              }),
              title: vCatchment.OBJECTID.toString(),
            }),
          );
        });
        const layerSubcatchmentGroupIDs = new L.LayerGroup(groupMarkerArray);
        this.dataService.groupIds = layerSubcatchmentGroupIDs;
        this.dataService.map.addLayer(layerSubcatchmentGroupIDs);
      }
      this.scenarioService.setNoOfCatchments(this.subcatchmentIds.length);
    });
  }

  /**
   * Handle map interaction at different stages of the VDR.
   *
   * @param objectId ID used by Leaflet to locate the feature
   * @param vdrId ID used by the API/WSI-MOD to refer to a specific subcatchment ID
   */
  public handleMapClickLogic(objectId: number, vdrId: number): void {
    // Default map view selection
    if (this.dataService.currentStage === '') {
      this.handleMapDefaultSelection(objectId);
    } else if (this.dataService.currentStage === 'select') {
      this.handleMapScenarioSelection(objectId, vdrId);
    } else {
      this.snackbarService.sendInformative(
        'You are not in the select stage so are unable to add or remove subcatchments.',
        3000,
      );
    }
  }
}
