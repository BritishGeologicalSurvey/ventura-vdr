/* eslint-disable @typescript-eslint/indent */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

import { SnackbarService } from '../shared/components/snackbar/snackbar.service';
import { SimpleSendDict2RequestObj } from './objects/simpleObjects/SimpleSendDict2RequestObj';
import { SendDict2RequestObj } from './objects/vdr_SendDict2RequestObj';
import { SendDict2ResponseObj } from './objects/vdr_SendDict2ResponseObj';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private headers = new HttpHeaders();
  private baseUrl = 'YOUR_API';

  private USE_LIVE_API = false;

  /* The `NEAR_FUTURE_CALL` variable is a boolean flag that determines whether the mock API call should return
near future data or far future data */
  private NEAR_FUTURE_CALL = true;

  /* `private multiplier = is used to add a random modifer to the parameters within the response returned by
the mock API */
  private multiplier = Math.floor(Math.random() * 25) + 1;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
  ) {}

  public getData(requestData: SendDict2RequestObj): Promise<SendDict2ResponseObj> {
    const simpleData: SimpleSendDict2RequestObj = {
      nodes_numbers_to_change: [],
      RC_to_change: [],
      catchmentN4populationChange: [],
      PopulationChange: [],
      StartDate: '2011-11-30',
      EndDate: '2012-01-30',
      RainfallMultiplier: 1,
      PopulationGrowth: 1,
      catchmentN4wiltPointChange: [],
      newWiltPointMultiplier: [],
      catchmentN4demandChange: [],
      NewPerCapitaDemand: [],
      days2delete: 100,
      MinSimLength: 2,
    };

    return this.postVDR_SendDict2(requestData || new SendDict2RequestObj(simpleData));
  }

  private postVDR_SendDict2(reqData: SendDict2RequestObj): Promise<SendDict2ResponseObj> {
    const headers = (): HttpHeaders => {
      const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
      return httpHeaders;
    };

    const data = this.USE_LIVE_API
      ? this.doCall(['vdr_SendDict2'], `"${reqData.createRequestString()}"`, headers).then(
          (rawData) => new SendDict2ResponseObj(rawData as Record<string, unknown>),
        )
      : this.doMockCall();

    return Promise.resolve(data);
  }

  private doCall(
    urlSegments: string | Array<string>,
    bodyData: Record<string, unknown> | FormData | Array<unknown> | string,
    headerFilter?: (headers: HttpHeaders) => HttpHeaders,
    queryParams: Record<string, string | Array<string>> = {},
  ): Promise<unknown> {
    const url = this.getUrl(urlSegments);
    const options = {
      headers: headerFilter != null ? headerFilter(this.headers) : this.headers,
      params: queryParams,
    };

    const response: Observable<unknown> = this.http.post(url, bodyData, options);

    if (response != null) {
      return lastValueFrom(response)
        .then((data: unknown) => data)
        .catch((res: unknown) => {
          this.snackbarService.sendNegative('Error: unable to retrieve data from the API.');
          return res;
        });
    }
    return Promise.resolve(null);
  }

  public doMockCall(): Promise<SendDict2ResponseObj> {
    const scenario = this.NEAR_FUTURE_CALL ? 'near' : 'far';
    this.NEAR_FUTURE_CALL = !this.NEAR_FUTURE_CALL;
    return fetch(`assets/data/demo-senario-${scenario}.json`).then((response) =>
      response.json().then((val) => {
        const data = this.modifyMockResponseValues(new SendDict2ResponseObj(val), scenario);
        return data;
      }),
    );
  }

  private getUrl(segments: string | Array<string>): string {
    let vSegments = segments;
    vSegments = Array.isArray(segments) ? segments : [segments];

    const url = `${this.baseUrl}/${vSegments.join('/')}`;
    return url;
  }

  private modifyMockResponseValues(input: SendDict2ResponseObj, scenario: string): SendDict2ResponseObj {
    const multiplier = scenario === 'near' ? this.multiplier / 100 + 1 : (this.multiplier + 25) / 100 + 1;
    const multiply = (arr: Array<Array<number>>) => arr.map((item) => item.map((val) => val * multiplier));
    const output = new SendDict2ResponseObj({
      ManExcessWater: multiply(input.manExcessWater),
      ManFlowsDemand2foul: multiply(input.manFlowsDemand2foul),
      ManFoulToStormFlows: multiply(input.manFlowsDemand2foul),
      ManRiverAmmonia: multiply(input.manRiverAmmonia),
      ManRiverDFcolumns: input.manRiverDFcolumns,
      ManRiverFlows: multiply(input.manRiverFlows),
      ManRiverNitrate: multiply(input.manRiverNitrate),
      ManRiverP: multiply(input.manRiverP),
      manSewerDFcolumns: input.manSewerDFcolumns,
      ManSewerFlows: multiply(input.manSewerFlows),
      ManStormdischargeFlows: multiply(input.manStormdischargeFlows),
      ManWWTPdischargeDFcolumns: input.manWWTPdischargeDFcolumns,
      ManWWTPdischargeFlows: multiply(input.manWWTPdischargeFlows),
      SimulationDates: input.simulationDates,
    });
    return output;
  }
}
