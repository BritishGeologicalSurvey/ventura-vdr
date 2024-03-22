import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class PageLoadingService {
  private loadingCount = 0;
  private loadingStatusSource = new Subject<boolean>();
  public loadingStatusObservable = this.loadingStatusSource.asObservable();

  public watchLoadingStatus(): Observable<boolean> {
    return this.loadingStatusSource.asObservable();
  }

  public updateLoadingStatus(active: boolean) {
    this.loadingStatusSource.next(active);
  }

  public get isLoading(): boolean {
    return this.loadingCount !== 0;
  }

  public showLoading(show: boolean): void {
    if (show) {
      this.loadingCount++;
      this.updateLoadingStatus(true);
    } else {
      this.loadingCount--;
      if (this.loadingCount === 0) {
        this.updateLoadingStatus(false);
      }
    }
  }
}
