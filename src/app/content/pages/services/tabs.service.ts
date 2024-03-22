import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private activeTabView: BehaviorSubject<string> = new BehaviorSubject('map');
  public activeTabViewObservable = this.activeTabView.asObservable();

  public setActiveTabView(activeView: string) {
    this.activeTabView.next(activeView);
  }
}
