import { Injectable } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
  BehaviorSubject, map, Observable, ReplaySubject, Subject
} from 'rxjs';
import { BaselineScenario, NewScenario } from 'src/app/shared/models/scenario.model';

import { LocalStoragePersister } from './persisters/localStoragePersister';
import { ScenarioCache } from './persisters/scenarioCache.enum';

@Injectable({
  providedIn: 'root',
})
export class ScenarioService {
  constructor(private localStoragePersistor: LocalStoragePersister) {}

  private loadVDR: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loadVDRObservable = this.loadVDR.asObservable();

  private currentStage: BehaviorSubject<string> = new BehaviorSubject('');
  public currentStageObservable = this.currentStage.asObservable();

  private currentGroup: BehaviorSubject<number> = new BehaviorSubject(0);
  public currentIterationObservable = this.currentGroup.asObservable();

  private newScenario: ReplaySubject<NewScenario> = new ReplaySubject();
  public newScenarioObservable = this.newScenario.asObservable();

  private activeScenario: BehaviorSubject<string> = new BehaviorSubject('business-as-usual');
  public activeScenarioObservable = this.activeScenario.asObservable();

  private noOfCatchments: BehaviorSubject<number> = new BehaviorSubject(0);
  public noOfCatchmentsObservable = this.noOfCatchments.asObservable();

  private queryStr: BehaviorSubject<string> = new BehaviorSubject('');
  public queryStrObservable = this.queryStr.asObservable();

  private tabModeSelectionVisibilitySource = new BehaviorSubject<boolean>(true);
  public tabModeSelectionVisibilityObservable = this.tabModeSelectionVisibilitySource.asObservable();

  private shouldResetGroups = new BehaviorSubject<boolean>(false);
  public shouldResetGroupsObs = this.shouldResetGroups.asObservable();

  private resultsFromAPIComplete = new Subject<string>();
  public resultsFromAPICompleteObs = this.resultsFromAPIComplete.asObservable();

  private stepperRef!: MatStepper;

  public setLoadVDR(showVDR: boolean): void {
    this.loadVDR.next(showVDR);
  }

  public setCurrentStage(stage: string): void {
    this.currentStage.next(stage);
  }

  public setCurrentIteration(iteration: number): void {
    this.currentGroup.next(iteration);
  }

  public setStepperRef(stepper: MatStepper): void {
    this.stepperRef = stepper;
  }

  public getStepperRef(): MatStepper {
    return this.stepperRef;
  }

  public setNewScenario(data: NewScenario): void {
    this.newScenario.next(data);
  }

  public setActiveScenario(scenarioId: string): void {
    this.activeScenario.next(scenarioId);
  }

  public cacheAllScenarios(scenarios: Array<NewScenario | BaselineScenario>): Observable<unknown> {
    return this.localStoragePersistor.set(ScenarioCache.ALL_SCENARIOS, ScenarioService.parseResponse(scenarios));
  }

  public cacheNewScenarioInArray(newScenario: NewScenario): Observable<unknown> {
    return this.getAllScenarios().pipe(
      map((data) => {
        const allScenarios = ScenarioService.parseResponse(data) as Array<NewScenario | BaselineScenario>;

        if (allScenarios.length > 0) {
          const current = allScenarios.find((item) => item.scenarioId === newScenario.scenarioId);
          if (current) {
            allScenarios.splice(allScenarios.indexOf(current), 1, { ...current, ...newScenario });
          } else {
            allScenarios.push(newScenario);
          }

          return this.cacheAllScenarios(allScenarios);
        }
        return undefined;
      }),
    );
  }

  public removeScenario(allScenarios: Array<NewScenario | BaselineScenario>, idToRemove: string | undefined): void {
    if (allScenarios.length > 0 && idToRemove) {
      const current = allScenarios.find((item) => item.scenarioId === idToRemove);

      if (current) {
        const index = allScenarios.indexOf(current);
        allScenarios.splice(index, 1);
        this.cacheAllScenarios(allScenarios);
      }
    }
  }

  public getNewScenario(): Observable<unknown> {
    return this.localStoragePersistor.get(ScenarioCache.CACHED_NEW_SCENARIO);
  }

  public getAllScenarios(): Observable<unknown> {
    return this.localStoragePersistor.get(ScenarioCache.ALL_SCENARIOS);
  }

  public static parseResponse(data: unknown): any {
    if (typeof data === 'object') {
      return data;
    }
    return JSON.parse(data as string);
  }

  public setNoOfCatchments(noOfCatchments: number): void {
    this.noOfCatchments.next(noOfCatchments);
  }

  public getScenarioById(id: string): Observable<NewScenario | BaselineScenario | undefined> {
    return this.getAllScenarios().pipe(
      map((data) => {
        if (data) {
          const parsed = ScenarioService.parseResponse(data) as Array<NewScenario>;
          const dataCheck = parsed.find((scenario: NewScenario) => scenario.scenarioId === id) as
            | NewScenario
            | BaselineScenario;
          return dataCheck;
        }
        return undefined;
      }),
    );
  }

  public setTabModeSelectionVisibility(visibility: boolean): void {
    this.tabModeSelectionVisibilitySource.next(visibility);
  }

  public setShouldResetGroups(value: boolean) {
    this.shouldResetGroups.next(value);
  }

  public setResultsFromAPIComplete(newScenarioID: string) {
    this.resultsFromAPIComplete.next(newScenarioID);
  }
}
