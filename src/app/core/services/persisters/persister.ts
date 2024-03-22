import { Observable } from 'rxjs';

export interface Persister {
  set(key: string, value: unknown): Observable<undefined>;
  get(key: string): Observable<unknown>;
}
