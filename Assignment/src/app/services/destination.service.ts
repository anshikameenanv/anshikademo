import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private selectedDestinationSubject = new BehaviorSubject<boolean>(false);

  setSelectedDestination(destination: boolean) {
    this.selectedDestinationSubject.next(destination);
  }

  getSelectedDestination() {
    return this.selectedDestinationSubject.asObservable();
  }
}
