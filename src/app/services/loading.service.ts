import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(true);
  isLoading = this.loadingSubject.asObservable();

  constructor() { }

  public setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }


}
