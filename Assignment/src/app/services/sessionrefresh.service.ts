import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionrefreshService {


  private timeoutId: any;
  inactivityReached: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  resetTimer(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.inactivityReached.emit();
    }, 10 * 60 * 1000); // 20 minutes in milliseconds
  }

  startTimer(): void {
    document.addEventListener('mousemove', () => this.resetTimer());
    document.addEventListener('keypress', () => this.resetTimer());
    this.resetTimer();
  }
}
