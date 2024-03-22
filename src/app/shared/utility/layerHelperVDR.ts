/* eslint-disable @typescript-eslint/no-useless-constructor */
import * as L from 'leaflet';

import { VDRGeoJsonFeature } from '../objects/GEOJSONfeatureVDR.interface';

export class LayerHelperVDR extends L.Layer {
  public feature!: VDRGeoJsonFeature;

  constructor(options: L.LayerOptions) {
    super(options);
  }
}
