/* eslint-disable @typescript-eslint/indent */
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Nutrient } from 'src/app/shared/enums/nutrient.enum';
import { ResultTimePeriod } from 'src/app/shared/enums/time-period.enum';
import { SignificantFiguresPipe } from 'src/app/shared/pipes/significantFigures.pipe';
import { LayerHelperVDR } from 'src/app/shared/utility/layerHelperVDR';
import { environment } from 'src/environments/environment.base';

import { DataService } from './data.service';
import { LabelPresentationService } from './label/label-presentation.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(
    private sigFig: SignificantFiguresPipe,
    private dataService: DataService,
    private labelPresentationService: LabelPresentationService,
  ) {}

  /**
   * Create HTML popup for water flow data.
   *
   * @returns {void}
   */
  public createWaterFlowPopupDetails(): void {
    const getResult = (layer: LayerHelperVDR): string => {
      let result;
      const sigFigPipe = new SignificantFiguresPipe();

      switch (this.dataService.timePeriod) {
        case ResultTimePeriod.TODAY: {
          result = this.dataService.scenario.parsedDataToday?.ManRiverFlowsMean;
          break;
        }
        case ResultTimePeriod.NEAR_FUTURE: {
          result = this.dataService.scenario.parsedDataNearFuture?.ManRiverFlowsMean;
          break;
        }
        case ResultTimePeriod.FAR_FUTURE: {
          result = this.dataService.scenario.parsedDataFarFuture?.ManRiverFlowsMean;
          break;
        }
      }

      let resultFind = '';
      if (result != null) {
        resultFind = result
          .find((value: number, index: number) => (index === layer.feature.properties.VDR_ID ? value : null))
          ?.toString() as string;
      } else {
        resultFind = 'No Data';
      }

      let popupTemplate;
      popupTemplate = `
        <h2 class="border-b border-bgs-primary-stone">Water Flow</h2>
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
              <td class="p-2 border-b text-left">${layer.feature.properties.VDR_ID}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Period</td>
              <td class="p-2 border-b text-left">${this.dataService.timePeriod}</td>
            </tr>
            </tr>
            <tr>
            <tr>
              <td class="p-2 border-b text-left">Flow Rate</td>
              <td class="p-2 border-b text-left">
                ${
                  resultFind
                    ? `${sigFigPipe.transform(Number(resultFind), environment.sfWaterFlow)} ${environment.waterFlowUnits} to ${environment.sfWaterFlow} s.f`
                    : 'No Data'
                }
              </td>
            </tr>
          </tbody>
        </table>
      `;
      if (this.dataService.resultComparison) {
        const finalLabel = this.labelPresentationService.createDiffPopupFinalLabel(
          layer.feature.properties.VDR_ID,
          environment.sfWaterFlow,
          environment.waterFlowUnits,
        );
        popupTemplate = `
          <h2 class="border-b border-bgs-primary-stone">Water Flow</h2>
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
                <td class="p-2 border-b text-left">${layer.feature.properties.VDR_ID}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Period</td>
                <td class="p-2 border-b text-left">${this.dataService.timePeriod}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Flow Rate Change</td>
                <td class="p-2 border-b text-left">${finalLabel}</td>
              </tr>
            </tbody>
          </table>
        `;
      }
      return popupTemplate;
    };
    this.dataService.outletsLayer.bindPopup((layer: L.Layer) => {
      const layerVDR = layer as LayerHelperVDR;
      return L.Util.template(getResult(layerVDR), layerVDR.feature.properties);
    }, this.dataService.popupOptions);
  }

  /**
   * Create HTML popup for excess water data.
   *
   * @returns {void}
   */
  public createExcessWaterPopupDetails(): void {
    const getResult = (layer: LayerHelperVDR): string => {
      let result;
      switch (this.dataService.timePeriod) {
        case ResultTimePeriod.TODAY: {
          result = this.dataService.scenario.parsedDataToday?.ManExcessWaterMean;
          break;
        }
        case ResultTimePeriod.NEAR_FUTURE: {
          result = this.dataService.scenario.parsedDataNearFuture?.ManExcessWaterMean;
          break;
        }
        case ResultTimePeriod.FAR_FUTURE: {
          result = this.dataService.scenario.parsedDataFarFuture?.ManExcessWaterMean;
          break;
        }
      }

      let resultFind = '';
      if (result != null) {
        resultFind = result
          .find((value: number, index: number) => (index === layer.feature.properties.VDR_ID ? value : null))
          ?.toString() as string;
      } else {
        resultFind = 'No Data';
      }

      let popupTemplate = `
        <h2 class="border-b border-bgs-primary-stone">Excess Water</h2>
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
              <td class="p-2 border-b text-left">${layer.feature.properties.VDR_ID}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Period</td>
              <td class="p-2 border-b text-left">${this.dataService.timePeriod}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Excess Water</td>
              <td class="p-2 border-b text-left">${
                resultFind
                  ? `${this.sigFig.transform(Number(resultFind), environment.sfExcessWater)} ${
                      environment.excessWaterUnits
                    } to ${environment.sfExcessWater} s.f`
                  : 'No Data'
              }
              </td>
            </tr>
          </tbody>
        </table>
      `;

      if (this.dataService.resultComparison) {
        popupTemplate = `
          <h2 class="border-b border-bgs-primary-stone">Excess Water</h2>
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
                <td class="p-2 border-b text-left">${layer.feature.properties.VDR_ID}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Period</td>
                <td class="p-2 border-b text-left">${this.dataService.timePeriod}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Excess Water Change</td>
                <td class="p-2 border-b text-left">
                  ${this.labelPresentationService.createDiffPopupFinalLabel(
                    layer.feature.properties.VDR_ID,
                    environment.sfExcessWater,
                    environment.excessWaterUnits,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        `;
      }
      return popupTemplate;
    };

    this.dataService.centroidsLayer.bindPopup((layer: L.Layer) => {
      const layerVDR = layer as LayerHelperVDR;
      return L.Util.template(getResult(layerVDR), layerVDR.feature.properties);
    }, this.dataService.popupOptions);
  }

  /**
   * Create HTML popup for water quality data.
   *
   * @returns {void}
   */
  public createWaterQualityPopupDetails(): void {
    const getResult = (layer: LayerHelperVDR): string => {
      let result;
      const sigFigPipe = new SignificantFiguresPipe();

      switch (true) {
        case ResultTimePeriod.TODAY === this.dataService.timePeriod &&
          Nutrient.NITROGEN === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataToday?.ManRiverNitrateMean;
          break;
        }
        case ResultTimePeriod.TODAY === this.dataService.timePeriod &&
          Nutrient.PHOSPHORUS === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataToday?.ManRiverPMean;
          break;
        }
        case ResultTimePeriod.TODAY === this.dataService.timePeriod &&
          Nutrient.AMMONIA === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataToday?.ManRiverAmmoniaMean;
          break;
        }
        case ResultTimePeriod.NEAR_FUTURE === this.dataService.timePeriod &&
          Nutrient.NITROGEN === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataNearFuture?.ManRiverNitrateMean;
          break;
        }
        case ResultTimePeriod.NEAR_FUTURE === this.dataService.timePeriod &&
          Nutrient.PHOSPHORUS === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataNearFuture?.ManRiverPMean;
          break;
        }
        case ResultTimePeriod.NEAR_FUTURE === this.dataService.timePeriod &&
          Nutrient.AMMONIA === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataNearFuture?.ManRiverAmmoniaMean;
          break;
        }
        case ResultTimePeriod.FAR_FUTURE === this.dataService.timePeriod &&
          Nutrient.NITROGEN === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataFarFuture?.ManRiverNitrateMean;
          break;
        }
        case ResultTimePeriod.FAR_FUTURE === this.dataService.timePeriod &&
          Nutrient.PHOSPHORUS === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataFarFuture?.ManRiverPMean;
          break;
        }
        case ResultTimePeriod.FAR_FUTURE === this.dataService.timePeriod &&
          Nutrient.AMMONIA === this.dataService.nutrient.id: {
          result = this.dataService.scenario.parsedDataFarFuture?.ManRiverAmmoniaMean;
          break;
        }
      }

      let resultFind;
      if (result != null) {
        const value = result.find((digit: number, index: number) =>
          index === layer.feature.properties.VDR_ID ? digit : null,
        );
        resultFind = Number(value) * 1000000;
      } else {
        resultFind = 'No Data';
      }

      let popupTemplate = `
        <h2 class="border-b border-bgs-primary-stone">
          Water Quality: ${this.dataService.nutrient.name}
        </h2>
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
              <td class="p-2 border-b text-left">${layer.feature.properties.VDR_ID}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Period</td>
              <td class="p-2 border-b text-left">${this.dataService.timePeriod}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Compound</td>
              <td class="p-2 border-b text-left">${this.dataService.nutrient.name}</td>
            </tr>
            <tr>
              <td class="p-2 border-b text-left">Water Quality</td>
              <td class="p-2 border-b text-left">${
                resultFind
                  ? `${sigFigPipe.transform(Number(resultFind), environment.sfWaterQuality)} ${this.dataService.nutrient.units}` +
                    ` to ${environment.sfWaterQuality} s.f`
                  : 'No Data'
              }
              </td>
            </tr>
          </tbody>
        </table>
      `;

      if (this.dataService.resultComparison) {
        popupTemplate = `
          <h2 class="border-b border-bgs-primary-stone">Water Quality: ${this.dataService.nutrient.name}</h2>
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
                <td class="p-2 border-b text-left">${layer.feature.properties.VDR_ID}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Period</td>
                <td class="p-2 border-b text-left">${this.dataService.timePeriod}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Compound</td>
                <td class="p-2 border-b text-left">${this.dataService.nutrient.name}</td>
              </tr>
              <tr>
                <td class="p-2 border-b text-left">Water Quality Change</td>
                <td class="p-2 border-b text-left">
                  ${this.labelPresentationService.createDiffPopupFinalLabel(
                    layer.feature.properties.VDR_ID,
                    environment.sfWaterQuality,
                    environment.waterQualityUnits,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        `;
      }
      return popupTemplate;
    };

    this.dataService.outletsLayer.bindPopup((layer: L.Layer) => {
      const layerVDR = layer as LayerHelperVDR;
      return L.Util.template(getResult(layerVDR), layerVDR.feature.properties);
    }, this.dataService.popupOptions);
  }

  /**
   * Create HTML popup for waste water treatment plants.
   *
   * @returns {void}
   */
  public createWWTPPopupDetails(): void {
    const getResult = (layer: LayerHelperVDR): string => {
      const popupTemplate = `
        <h2 class="border-b border-bgs-primary-stone">Waste Water Treatment Plant</h2>
        <p class="text-base !mt-0 !mb-2">
          ${layer.feature.properties.WB_NAME}
        </p>
        <table class="table-auto w-full px-3">
          <thead>
            <tr>
              <th class="border-b-2 border-gray-200 uppercase p-2">Attribute</th>
              <th class="border-b-2 border-gray-200 uppercase p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border-b text-left">Name</td>
              <td class="p-2 border-b text-left">${layer.feature.properties.uwwName}</td>
            </tr>
            </thead>
          <tbody>
            <tr>
              <td class="p-2 border-b text-left">Capacity</td>
              <td class="p-2 border-b text-left">${layer.feature.properties.uwwCapacit} m&sup3;</td>
            </tr>
          </tbody>
        </table>
      `;
      return popupTemplate;
    };

    this.dataService.wwtpLayer.bindPopup((layer: L.Layer) => {
      const layerVDR = layer as LayerHelperVDR;
      return L.Util.template(getResult(layerVDR), layerVDR.feature.properties);
    }, this.dataService.popupOptions);
  }
}
