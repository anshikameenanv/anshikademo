import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _stripeSessionId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  get stripeSessionId$() {
    return this._stripeSessionId.asObservable();
  }

  setStripeSessionId(sessionId: string) {
    this._stripeSessionId.next(sessionId);
  }
}
