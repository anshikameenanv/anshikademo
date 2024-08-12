import { ConstantPool } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { timer } from 'rxjs';
import { FlightServiceService } from 'src/app/services/flight-service.service';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
@Component({
    selector: 'app-payment-successful',
    templateUrl: './payment-successful.component.html',
    styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent {
    timeLeft: number = 100
    interval: string | number | NodeJS.Timeout | undefined;
    subscribeTimer: any;
    minutesDisplay: number = 0;
    secondsDisplay: number = 0;
    sessionId: any;
    errorMessage: any;
    showMessage: boolean = false;
    constructor(private route: ActivatedRoute, private paymentService: FlightServiceService, private flightService: FlightsearchService, private router: Router) { }

    ngOnInit(): void {
        //this.startTimer();
        this.route.queryParams.subscribe(params => {
            this.sessionId = params['sessionId'];
        });
        const userData = localStorage.getItem('UserData');
        if (userData) {
            const data = JSON.parse(userData);
            this.flightService.confirmBooking(this.sessionId, data.id).subscribe(response => {
                if (response.data != null) {
                    this.flightService.getSuccessBookingData(response);
                    this.router.navigate(['/review']);
                } else {
                    this.showMessage = true;
                    this.errorMessage = response.message;
                }
            });
        } else {
            this.flightService.confirmBooking(this.sessionId).subscribe(response => {
                if (response.data != null) {

                    this.flightService.getSuccessBookingData(response);
                    this.router.navigate(['/review']);
                } else {
                    this.showMessage = true;
                    this.errorMessage = response.message;
                }
            });
        }
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.minutesDisplay = Math.floor(this.timeLeft / 60);
                this.secondsDisplay = this.timeLeft % 60;
            } else {
                clearInterval(this.interval);
                this.closeComponent();
            }
        }, 1000);
    }

    closeComponent() {
        sessionStorage.clear();
        //this.router.navigate(['']);
    }
}
