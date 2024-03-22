import { SendDict2ResponseObj } from 'src/app/api/objects/vdr_SendDict2ResponseObj';

export class ParsedData {
  public readonly ManRiverFlowsMean: Array<number>;
  public readonly ManRiverAmmoniaMean: Array<number>;
  public readonly ManRiverPMean: Array<number>;
  public readonly ManRiverNitrateMean: Array<number>;
  public readonly ManExcessWaterMean: Array<number>;

  constructor(sourceObject: SendDict2ResponseObj) {
    this.ManRiverFlowsMean = this.mean(sourceObject.manRiverFlows);
    this.ManRiverAmmoniaMean = this.mean(sourceObject.manRiverAmmonia);
    this.ManRiverPMean = this.mean(sourceObject.manRiverP);
    this.ManRiverNitrateMean = this.mean(sourceObject.manRiverNitrate);
    this.ManExcessWaterMean = this.mean(sourceObject.manExcessWater);
  }

  private mean(arrays: Array<Array<number>>): Array<number> {
    const result = [];
    for (const i in arrays[0]) {
      let total = 0;
      for (const arr of arrays) {
        total += arr[i];
      }
      result.push(total / arrays.length);
    }
    return result;
  }

  private min(arrays: Array<Array<number>>): Array<number> {
    const min = arrays.reduce((final, current) => {
      const vFinal = final;
      for (let i = 0; i < vFinal.length; ++i) {
        if (current[i] < vFinal[i]) {
          vFinal[i] = current[i];
        }
      }
      return vFinal;
    });
    return min;
  }

  private max(arrays: Array<Array<number>>): Array<number> {
    const max = arrays.reduce((final, current) => {
      for (let i = 0; i < final.length; ++i) {
        if (current[i] > final[i]) {
          final[i] = current[i];
        }
      }
      return final;
    });
    return max;
  }
}
