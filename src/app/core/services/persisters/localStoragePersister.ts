import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, Observable } from 'rxjs';

import { Persister } from './persister';

@Injectable()
export class LocalStoragePersister implements Persister {
  private readonly STORAGE_PREFIX = 'VDR_';

  constructor(private storage: StorageMap) {}

  /**
   * Sets an item to local storage.
   * @param key {string} that identifies the item.
   * @param value {any} value to persist.
   * this.storage.set('user', user).subscribe(() => {});
   */

  // NOT WORKING BUT HOW WE WANT IT TO RUN
  // public set(key: string, value: unknown): Observable<undefined> {
  //   const storageKey = this.STORAGE_PREFIX + key;
  //   return this.storage.set(storageKey, JSON.stringify(value)).pipe(map((data) => {
  //     return data;
  //   }));
  // }

  // public set(key: string, value: unknown): Observable<undefined> {
  // const storageKey = this.STORAGE_PREFIX + key;
  // const stringy = JSON.stringify(value);
  // return this.storage.set(storageKey, stringy).pipe(
  //   switchMap(response => {
  //     return);
  // })
  // }

  // WORKING BUT NOT RETURNING WHEN COMPLETE
  public set(key: string, value: unknown): Observable<undefined> {
    // console.debug('set persistor', key, value);
    const storageKey = this.STORAGE_PREFIX + key;
    this.storage.set(storageKey, JSON.stringify(value)).subscribe(() => {
      // console.debug('**** SET SUB FINISH');
    });

    // console.debug('>>>>>> SET METHOD FINISH');
    return this.storage.set(storageKey, JSON.stringify(value));
  }

  /**
   * Retrieves an item from local storage.
   * @param key {string} that identifies the item.
   */
  public get(key: string): Observable<unknown> {
    const storageKey = this.STORAGE_PREFIX + key;
    return this.storage.get(storageKey).pipe(map((data) => data));
  }
}
