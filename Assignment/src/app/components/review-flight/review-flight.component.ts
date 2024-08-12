import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { SigninService } from 'src/app/services/signin.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TaxService } from 'src/app/services/tax.service';
import { UserService } from 'src/app/services/user.service';
import { WebcheckInService } from 'src/app/services/webcheck-in.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-review-flight',
  templateUrl: './review-flight.component.html',
  styleUrls: ['./review-flight.component.scss']
})
export class ReviewFlightComponent {
  bookingResponse: any = [];
  flightPriceData: any = [];
  failedMeesage: any;
  userId: any;
  taxAmount:any;
  showBookingMessage: boolean = false;
  private password = environment.password;
  tripTotal: any;

  constructor(private flightService: FlightsearchService, private snackBarService: SnackbarService,
    private webCheck: WebcheckInService, private authService: AuthService,  private tax:TaxService) {

  }
  ngOnInit(): void {
    this.flightService.reviewData$.subscribe(data => {
      this.failedMeesage = data.message;
      this.bookingResponse = data.data[0];
    });

    const flightOffers = this.bookingResponse.flightOffers;
    for (let i = 0; i < flightOffers.length; i++) {
      const flightOffer = flightOffers[i];
      let flightdetails = {
        flight: flightOffer.itineraries[0].segments,
        price: flightOffer.price,
        travelerPricings: flightOffer.travelerPricings
      }
      this.flightPriceData.push(flightdetails);
    }
    if (!this.authService.isLoggedIn()) {
      this.showBookingMessage = true;
    }
this.getTaxAmount();
  }
  getTaxAmount(){
    const amount = this.calculateTotalGrandTotal();
    this.tax.getTaxAmount(amount).subscribe((response:any)=>{
      this.taxAmount=response.data.item1[0].percentageAmount;
      this.tripTotal = response.data.item2.toFixed(2);
    })
  }
  getFareDetailBySegmentId(segmentId: string): any | null {
    for (const flight of this.flightPriceData) {
      for (const travelerPricing of flight.travelerPricings) {
        const seat = [];
        for (const fareDetail of travelerPricing.fareDetailsBySegment) {
          if (fareDetail.segmentId === segmentId) {
            const basePrice = parseFloat(travelerPricing.price.base);
            const totalTaxes = travelerPricing.price.taxes.reduce((acc: number, tax: any) => acc + parseFloat(tax.amount), 0);
            const totalPrice = basePrice + totalTaxes;

            if (fareDetail.additionalServices && fareDetail.additionalServices.chargeableSeatNumber) {
              seat.push(fareDetail.additionalServices.chargeableSeatNumber);
              return {
                cabin: fareDetail.cabin,
                price: totalPrice,
                seat: seat
              };
            } else {
              return {
                cabin: fareDetail.cabin,
                price: totalPrice
              };
            }
          }
        }
      }
    }
    return null;
  }

  getEticket() {
    this.snackBarService.showSnackBar("Coming Soon", 'custom-snackbar-success');

  }
  calculateTotalFare(): number {
    let totalFare: number = 0;
    for (const flightResult of this.flightPriceData) {
      totalFare += parseFloat(flightResult.price.base);
    }
    return totalFare;
  }

  calculateTotalGrandTotal(): number {
    let totalGrandTotal: number = 0;
    for (const flightResult of this.flightPriceData) {
      totalGrandTotal += parseFloat(flightResult.price.grandTotal);
    }
    return totalGrandTotal;
  }
  webCheckIn(airLineCode: any) {

    this.webCheck.webCheckIn(airLineCode).subscribe((data: any) => {

      if (data.data && data.data.length > 0) {

        window.open(data.data[0].url, "_blank");

      } else {
        this.snackBarService.showSnackBar("For this flight webcheckin is not available", 'custom-snackbar-error');
      }
    })
  }
}