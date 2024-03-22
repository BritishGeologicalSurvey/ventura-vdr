import { ParsedData } from 'src/app/shared/objects/parsedData';

import { BaselineFar } from './baseline-far';
import { BaselineNear } from './baseline-near';
import { BaselineToday } from './baseline-today';
import { ScenarioAFar } from './scenario-a/scenario-a-far';
import { ScenarioANear } from './scenario-a/scenario-a-near';
import { ScenarioBFar } from './scenario-b/scenario-b-far';
import { ScenarioBNear } from './scenario-b/scenario-b-near';
import { ScenarioCFar } from './scenario-c/scenario-c-far';
import { ScenarioCNear } from './scenario-c/scenario-c-near';

export const scenarios = {
  baselineData: {
    scenarioName: 'Business as usual',
    description: 'Business as usual',
    scenarioId: 'business-as-usual',
    parsedDataToday: new ParsedData(BaselineToday),
    parsedDataNearFuture: new ParsedData(BaselineNear),
    parsedDataFarFuture: new ParsedData(BaselineFar),
  },
  scenarioAData: {
    scenarioName: 'Urban retrofit',
    description: 'Urban retrofit',
    scenarioId: 'scenario-a',
    parsedDataToday: new ParsedData(BaselineToday),
    parsedDataNearFuture: new ParsedData(ScenarioANear),
    parsedDataFarFuture: new ParsedData(ScenarioAFar),
    ids: [25, 36, 7, 14, 30],
    activeSubcatchmentProperties: [
      {
        FID: 11,
        OBJECTID: 11,
        WB_NAME: 'Mersey (upstream of Manchester Ship Canal)',
        VDR_ID: 25,
        Runoff_coe: 0.71,
        Green_Spac: 0.29,
        Population: 163235.257464,
        Near_term_: 0,
        Far_term_d: 2430.300661,
        Water_dema: 143,
        Shape_Leng: 143891.604196,
        Prop_imper: 0.386611,
        Shape__Area: 153337972.328003,
        Shape__Length: 143891.604195706,
        GROUP_ID: 0,
      },
      {
        FID: 37,
        OBJECTID: 37,
        WB_NAME: 'Sinderland Brook (Fairywell Bk and Baguley Bk)',
        VDR_ID: 36,
        Runoff_coe: 0.82,
        Green_Spac: 0.18,
        Population: 94760.647131,
        Near_term_: 0,
        Far_term_d: 497.632993,
        Water_dema: 143,
        Shape_Leng: 57202.5492404,
        Prop_imper: 0.522943,
        Shape__Area: 72369419.2696533,
        Shape__Length: 57202.5492404376,
        GROUP_ID: 0,
      },
      {
        FID: 20,
        OBJECTID: 20,
        WB_NAME: 'Chorlton Brook (Princess Parkway to Mersey)',
        VDR_ID: 7,
        Runoff_coe: 0.85,
        Green_Spac: 0.15,
        Population: 57337.387227,
        Near_term_: 0,
        Far_term_d: 636.507316,
        Water_dema: 143,
        Shape_Leng: 37833.8223231,
        Prop_imper: 0.521145,
        Shape__Area: 32757175.8062744,
        Shape__Length: 37833.8223231265,
        GROUP_ID: 0,
      },
      {
        FID: 33,
        OBJECTID: 33,
        WB_NAME: 'Fallowfield Brook',
        VDR_ID: 14,
        Runoff_coe: 0.9,
        Green_Spac: 0.1,
        Population: 40352.628682,
        Near_term_: 0,
        Far_term_d: 543.924434,
        Water_dema: 143,
        Shape_Leng: 30624.866009,
        Prop_imper: 0.593985,
        Shape__Area: 20209172.0158691,
        Shape__Length: 30624.8660089567,
        GROUP_ID: 0,
      },
      {
        FID: 19,
        OBJECTID: 19,
        WB_NAME: 'Platt Brook (Source to Fallowfield Bk)',
        VDR_ID: 30,
        Runoff_coe: 0.79,
        Green_Spac: 0.21,
        Population: 77525.36833,
        Near_term_: 0,
        Far_term_d: 729.090198,
        Water_dema: 143,
        Shape_Leng: 44309.3490099,
        Prop_imper: 0.522817,
        Shape__Area: 41279504.3515625,
        Shape__Length: 44309.3490098777,
        GROUP_ID: 0,
      },
    ],
  },
  scenarioBData: {
    scenarioName: 'Increased urbanisation',
    description: 'Increased urbanisation',
    scenarioId: 'scenario-b',
    parsedDataToday: new ParsedData(BaselineToday),
    parsedDataNearFuture: new ParsedData(ScenarioBNear),
    parsedDataFarFuture: new ParsedData(ScenarioBFar),
    ids: [40, 43, 17, 11, 38],
    activeSubcatchmentProperties: [
      {
        FID: 4,
        OBJECTID: 4,
        WB_NAME: 'Tame (Swineshaw Brook to Mersey)',
        VDR_ID: 40,
        Runoff_coe: 0.73,
        Green_Spac: 0.27,
        Population: 107119.256013,
        Near_term_: 0,
        Far_term_d: 1597.05472,
        Water_dema: 143,
        Shape_Leng: 79668.9150043,
        Prop_imper: 0.458304,
        Shape__Area: 103602071.746094,
        Shape__Length: 79668.9150043385,
        GROUP_ID: 0,
      },
      {
        FID: 3,
        OBJECTID: 3,
        WB_NAME: 'Goyt (Etherow to Mersey)',
        VDR_ID: 17,
        Runoff_coe: 0.6,
        Green_Spac: 0.4,
        Population: 37008.214871,
        Near_term_: 0,
        Far_term_d: 543.924434,
        Water_dema: 143,
        Shape_Leng: 46631.7054657,
        Prop_imper: 0.299894,
        Shape__Area: 59867359.0422363,
        Shape__Length: 46631.7054657469,
        GROUP_ID: 0,
      },
      {
        FID: 40,
        OBJECTID: 40,
        WB_NAME: 'Etherow (Glossop Brook to Goyt)',
        VDR_ID: 11,
        Runoff_coe: 0.39,
        Green_Spac: 0.61,
        Population: 9809.905073,
        Near_term_: 0,
        Far_term_d: 150.447184,
        Water_dema: 143,
        Shape_Leng: 44777.246741,
        Prop_imper: 0.060792,
        Shape__Area: 63667678.1933594,
        Shape__Length: 44777.2467409826,
        GROUP_ID: 0,
      },
      {
        FID: 27,
        OBJECTID: 27,
        WB_NAME: 'Wilson Brook',
        VDR_ID: 43,
        Runoff_coe: 0.62,
        Green_Spac: 0.38,
        Population: 19223.640343,
        Near_term_: 0,
        Far_term_d: 474.487272,
        Water_dema: 143,
        Shape_Leng: 27383.0513196,
        Prop_imper: 0.337298,
        Shape__Area: 26969604.6121826,
        Shape__Length: 27383.051319552,
        GROUP_ID: 0,
      },
      {
        FID: 8,
        OBJECTID: 8,
        WB_NAME: 'Tame (Chew Brook to Swineshaw Brook)',
        VDR_ID: 38,
        Runoff_coe: 0.47,
        Green_Spac: 0.53,
        Population: 29903.786431,
        Near_term_: 0,
        Far_term_d: 879.537382,
        Water_dema: 143,
        Shape_Leng: 49072.7504193,
        Prop_imper: 0.185671,
        Shape__Area: 82160933.8380127,
        Shape__Length: 49072.7504193083,
        GROUP_ID: 0,
      },
    ],
  },
  scenarioCData: {
    scenarioName: 'Combined urban retrofit and increased urbanisation',
    description: 'Combined urban retrofit and increased urbanisation',
    scenarioId: 'scenario-c',
    parsedDataToday: new ParsedData(BaselineToday),
    parsedDataNearFuture: new ParsedData(ScenarioCNear),
    parsedDataFarFuture: new ParsedData(ScenarioCFar),
    ids: [25, 36, 7, 14, 30, 40, 17, 11, 43, 38],
    activeSubcatchmentProperties: [
      {
        FID: 11,
        OBJECTID: 11,
        WB_NAME: 'Mersey (upstream of Manchester Ship Canal)',
        VDR_ID: 25,
        Runoff_coe: 0.71,
        Green_Spac: 0.29,
        Population: 163235.257464,
        Near_term_: 0,
        Far_term_d: 2430.300661,
        Water_dema: 143,
        Shape_Leng: 143891.604196,
        Prop_imper: 0.386611,
        Shape__Area: 153337972.328003,
        Shape__Length: 143891.604195706,
        GROUP_ID: 0,
      },
      {
        FID: 37,
        OBJECTID: 37,
        WB_NAME: 'Sinderland Brook (Fairywell Bk and Baguley Bk)',
        VDR_ID: 36,
        Runoff_coe: 0.82,
        Green_Spac: 0.18,
        Population: 94760.647131,
        Near_term_: 0,
        Far_term_d: 497.632993,
        Water_dema: 143,
        Shape_Leng: 57202.5492404,
        Prop_imper: 0.522943,
        Shape__Area: 72369419.2696533,
        Shape__Length: 57202.5492404376,
        GROUP_ID: 0,
      },
      {
        FID: 20,
        OBJECTID: 20,
        WB_NAME: 'Chorlton Brook (Princess Parkway to Mersey)',
        VDR_ID: 7,
        Runoff_coe: 0.85,
        Green_Spac: 0.15,
        Population: 57337.387227,
        Near_term_: 0,
        Far_term_d: 636.507316,
        Water_dema: 143,
        Shape_Leng: 37833.8223231,
        Prop_imper: 0.521145,
        Shape__Area: 32757175.8062744,
        Shape__Length: 37833.8223231265,
        GROUP_ID: 0,
      },
      {
        FID: 33,
        OBJECTID: 33,
        WB_NAME: 'Fallowfield Brook',
        VDR_ID: 14,
        Runoff_coe: 0.9,
        Green_Spac: 0.1,
        Population: 40352.628682,
        Near_term_: 0,
        Far_term_d: 543.924434,
        Water_dema: 143,
        Shape_Leng: 30624.866009,
        Prop_imper: 0.593985,
        Shape__Area: 20209172.0158691,
        Shape__Length: 30624.8660089567,
        GROUP_ID: 0,
      },
      {
        FID: 19,
        OBJECTID: 19,
        WB_NAME: 'Platt Brook (Source to Fallowfield Bk)',
        VDR_ID: 30,
        Runoff_coe: 0.79,
        Green_Spac: 0.21,
        Population: 77525.36833,
        Near_term_: 0,
        Far_term_d: 729.090198,
        Water_dema: 143,
        Shape_Leng: 44309.3490099,
        Prop_imper: 0.522817,
        Shape__Area: 41279504.3515625,
        Shape__Length: 44309.3490098777,
        GROUP_ID: 0,
      },
      {
        FID: 4,
        OBJECTID: 4,
        WB_NAME: 'Tame (Swineshaw Brook to Mersey)',
        VDR_ID: 40,
        Runoff_coe: 0.73,
        Green_Spac: 0.27,
        Population: 107119.256013,
        Near_term_: 0,
        Far_term_d: 1597.05472,
        Water_dema: 143,
        Shape_Leng: 79668.9150043,
        Prop_imper: 0.458304,
        Shape__Area: 103602071.746094,
        Shape__Length: 79668.9150043385,
        GROUP_ID: 1,
      },
      {
        FID: 3,
        OBJECTID: 3,
        WB_NAME: 'Goyt (Etherow to Mersey)',
        VDR_ID: 17,
        Runoff_coe: 0.6,
        Green_Spac: 0.4,
        Population: 37008.214871,
        Near_term_: 0,
        Far_term_d: 543.924434,
        Water_dema: 143,
        Shape_Leng: 46631.7054657,
        Prop_imper: 0.299894,
        Shape__Area: 59867359.0422363,
        Shape__Length: 46631.7054657469,
        GROUP_ID: 1,
      },
      {
        FID: 40,
        OBJECTID: 40,
        WB_NAME: 'Etherow (Glossop Brook to Goyt)',
        VDR_ID: 11,
        Runoff_coe: 0.39,
        Green_Spac: 0.61,
        Population: 9809.905073,
        Near_term_: 0,
        Far_term_d: 150.447184,
        Water_dema: 143,
        Shape_Leng: 44777.246741,
        Prop_imper: 0.060792,
        Shape__Area: 63667678.1933594,
        Shape__Length: 44777.2467409826,
        GROUP_ID: 1,
      },
      {
        FID: 27,
        OBJECTID: 27,
        WB_NAME: 'Wilson Brook',
        VDR_ID: 43,
        Runoff_coe: 0.62,
        Green_Spac: 0.38,
        Population: 19223.640343,
        Near_term_: 0,
        Far_term_d: 474.487272,
        Water_dema: 143,
        Shape_Leng: 27383.0513196,
        Prop_imper: 0.337298,
        Shape__Area: 26969604.6121826,
        Shape__Length: 27383.051319552,
        GROUP_ID: 1,
      },
      {
        FID: 8,
        OBJECTID: 8,
        WB_NAME: 'Tame (Chew Brook to Swineshaw Brook)',
        VDR_ID: 38,
        Runoff_coe: 0.47,
        Green_Spac: 0.53,
        Population: 29903.786431,
        Near_term_: 0,
        Far_term_d: 879.537382,
        Water_dema: 143,
        Shape_Leng: 49072.7504193,
        Prop_imper: 0.185671,
        Shape__Area: 82160933.8380127,
        Shape__Length: 49072.7504193083,
        GROUP_ID: 1,
      },
    ],
  },
};
