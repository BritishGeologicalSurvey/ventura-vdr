export interface VDRGeoJsonFeature {
  geometry: GeoJSON.Geometry;
  id: number;
  type: GeoJSON.GeoJsonTypes;
  properties: {
    OBJECTID: number;
    VDR_ID: number;
    WB_NAME: string;
    uwwCapacit?: number;
    uwwCode?: string;
    uwwName?: string;
    Population: number;
    Shape__Area: number;
  };
}
