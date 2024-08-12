import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { SelectSeatComponent } from '../select-seat/select-seat.component';
import { SelectFlightComponent } from '../select-flight/select-flight.component';
import { TaxService } from 'src/app/services/tax.service';
@Component({
  selector: 'app-ticket-summary',
  templateUrl: './ticket-summary.component.html',
  styleUrls: ['./ticket-summary.component.scss']
})
export class TicketSummaryComponent {
  @Input() selectedFlightOffer: any;
  @Input() totalTravelers: number = 1;
  @Input() flightDeatils: any = [];
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() selectedSeatsData: any = [];
  @Input() travellerType: any = [];
  @Input() tripType: any = [];
  tripTotal: number = 0;
  isActive = false;
  flightData: any = [];
  numTravelers: any;
  flightSuccess: boolean = false;
  isLoading: boolean = false;
  showSeatSelection: boolean = true;
  selectedseatNumber: any[][] = [];
  cityDetail: any = [];
  additionalPrices: any = [];
  updatedPrice: number =0;
  constructor(private router: Router, public flightService: FlightsearchService, private dialog: MatDialog, private tax: TaxService, private element: ElementRef) {

  }
  ngOnInit() {
    this.flightData = this.selectedFlightOffer;
    for (let flight of this.selectedFlightOffer) {
      this.cityDetail.push(...flight.departureCitys);
      this.cityDetail.push(...flight.arrivalCitys);
    }
    this.numTravelers = this.totalTravelers;
    this.tripType = this.tripTypeConversion(this.tripType);
    const extractedSeatNumbers: any[][] = [];

    this.selectedSeatsData.forEach((row: any[]) => {
 
      const rowExtractedSeatNumbers: any[] = [];
      row.forEach(subArray => {
   
        if(subArray.length >0){
          
        
        const subArraySeatNumbers: any[] = [];
        subArray.forEach((seat: { travelerPricing: any[]; number: any; }) => {
          if (seat.travelerPricing.some(pricing => pricing.seatAvailabilityStatus === "AVAILABLE")) {
            subArraySeatNumbers.push(seat.number);
          }
        });
        rowExtractedSeatNumbers.push(subArraySeatNumbers);
      }

      });

      extractedSeatNumbers.push(rowExtractedSeatNumbers);
    });


    this.selectedseatNumber.push(...extractedSeatNumbers);

    this.getAmountChange();

    // this.getTaxAmount();

  }
  // Function to calculate layover time
getLayoverTime(arrivalTime: string, departureTime: string): string {
  const arrivalDate = new Date(arrivalTime);
  const departureDate = new Date(departureTime);

  // Calculate the difference in milliseconds
  const differenceInMs = departureDate.getTime() - arrivalDate.getTime();

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

  // Return formatted layover time
  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

// Function to get layover time for a segment
getLayoverInfo(segment: any, segments: any[]): string {
  const index = segments.indexOf(segment);
  if (index < 0 || index >= segments.length - 1) {
    return ''; // No layover if index is invalid or last segment
  }

  const arrivalTime = segments[index].arrival.at;
  const departureTime = segments[index + 1].departure.at;

  return this.getLayoverTime(arrivalTime, departureTime);
}

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToTop();
    }, 0);
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getAmountChange(){
this.isLoading = true;
    let result: any = [];
    const seatFlightData = this.getSeatData(this.flightData, this.selectedSeatsData);
  
    sessionStorage.setItem('tripType', JSON.stringify(this.tripType));
    if (seatFlightData.length > 0) {
      let request = [];
      for (let i = 0; i < seatFlightData.length; i++) {
        request.push(seatFlightData[i].flightOffers[0]);
      }
      for (let i = 0; i < request.length; i++) {
        for (let j = i + 1; j < request.length; j++) {
          if (request[i].id === request[j].id) {
            request[j].id = request[i].id + 1;
            i = 0;
            break;
          }
        }
      }
      this.flightService.getFlightOffers(request).subscribe((data: any) => {
        if (data) {
          result.push(data.data.data);
    
   
            this.getTaxAmount(data.data.data.flightOffers);
          this.isLoading = false;
       
          
          
          // this.flightService.getPaymentData(result, this.travellerType);
          // this.router.navigate(['/flightpayment']);
        }
        else {
          this.isLoading = false;
        }
      })
    }
  }
  tripTypeConversion(input: string): string {
    switch (input) {
      case 'oneWay':
        return 'one way trip';
      case 'roundTrip':
        return 'round trip';
      case 'multiCity':
        return 'Multicity trip';
      default:
        return 'one way trip';
    }
  }
  onClose() {
    this.close.emit();
  }
  calculateGrandTotal(result:any): any {
    let grandTotal = 0;
    for (let flight of result) {
      grandTotal += parseFloat(flight.price.grandTotal);
      // console.log(flight.price.grandTotal);
      // if(flight.price.grandTotal){
      //   grandTotal += parseFloat(flight.price.grandTotal);
      // }else{
      //   grandTotal += parseFloat(flight.price.total);
      // }
  
    }
    const totalForAllTravelers = grandTotal * this.numTravelers;
    return totalForAllTravelers.toFixed(2);

  }

  extractDateTime(dateTimeString: any) {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = dateTime.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
    const day = dateTime.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day}, ${date}`;
  }
  toggleClass(): void {
    this.isActive = !this.isActive;
  }
  toggleClass2(): void {
    this.isActive = !this.isActive;
  }
  selectedValue: string | undefined;

  isClassActive: boolean = false;

  toggleClasspop() {
    this.isClassActive = !this.isClassActive;
  }
  removeClass() {
    this.isClassActive = false;
  }
  changeSelectedFlight(index: any) {
    this.close.emit(index);
  }
  openPopUpPrice(data: any) {

      const dialogRef = this.dialog.open(SelectFlightComponent, {
        width: '800px',
        data: {
          data1: data
        },
        panelClass: ['flightComponentpopupNew']
      });
  }
  getAirlineCommonNameFromSegment(segment: any): string | null {
    const airlines = this.flightData[0].airlines;
    if (!segment || !segment.carrierCode || !airlines || airlines.length === 0) {
      return null;
    }

    const airline = airlines.find((airline: any) => airline.carrierCode === segment.carrierCode);
    return airline ? airline.commonName : null;
  }
  getTotalAmount(data: { amount: string; type: string }[]): number {
    const total = data.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);
  
    // Round to two decimal places and convert back to number
    return parseFloat(total.toFixed(2));
  }
  
  booking() {
    this.isLoading = true;
    let result: any = [];
    const seatFlightData = this.getSeatData(this.flightData, this.selectedSeatsData);

    sessionStorage.setItem('tripType', JSON.stringify(this.tripType));
    if (seatFlightData.length > 1) {
      let request = [];
      for (let i = 0; i < seatFlightData.length; i++) {
        request.push(seatFlightData[i].flightOffers[0]);
      }
      for (let i = 0; i < request.length; i++) {
        for (let j = i + 1; j < request.length; j++) {
          if (request[i].id === request[j].id) {
            request[j].id = request[i].id + 1;
            i = 0;
            break;
          }
        }
      }
      this.flightService.getFlightOffers(request).subscribe((data: any) => {
        if (data) {

          this.isLoading = false;
          result.push(data.data.data);

          this.flightService.getPaymentData(result, this.travellerType);
          this.router.navigate(['/flightpayment']);
        }
        else {
          this.isLoading = false;
        }
      })
    } else {
      this.flightService.getFlightOffers(seatFlightData[0].flightOffers[0]).subscribe((data: any) => {
        if (data) {
          this.isLoading = false;
          result.push(data.data.data);

          this.flightService.getPaymentData(result, this.travellerType);
          this.router.navigate(['/flightpayment']);
        }
        else {
          this.isLoading = false;
        }
      })

    }

  }
  getSeatData(flightData: any, selectedSeat: any): any {
debugger;
    if (selectedSeat.length > 0) {
      for (let i = 0; i < flightData.length; i++) {
        const seat = selectedSeat[i];
        const offer = flightData[i].flightOffers;
        if (selectedSeat[i].length > 0) {


          const seatData = seat[0];
          for (let j = 0; j < offer[0].travelerPricings.length; j++) {
            if (offer[0].travelerPricings[j].travelerType != 'HELD_INFANT') {
              const fareDetail = offer[0].travelerPricings[j].fareDetailsBySegment;
              for (let k = 0; k < fareDetail.length; k++) {
                if (fareDetail.length > 1) {
               
                  if(seat[k].length >0){
                    const seatNumber = seat[k];
                    fareDetail[k].additionalServices = {
                      chargeableSeatNumber: seatNumber[j].number
                    }
                  }
                 
                }
                else {
                  fareDetail[k].additionalServices = {
                    chargeableSeatNumber: seatData[j].number
                  }
                }
              }
            }

          }
        }
      }
      return flightData;
    }


  }

  getTaxAmount(result:any) {

    const amount = this.calculateGrandTotal(result);
    this.tax.getTaxAmount(amount).subscribe((response: any) => {
      this.additionalPrices = response.data.item1
      this.tripTotal = response.data.item2;
    })
  }
  convertSimpleDuration(duration: string): string {

    // Extract hours and minutes using regular expressions
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);

    // Default to 0 hours and 0 minutes if not found
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    // Build the formatted duration string
    let result = '';
    if (hours > 0) {
      result += `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result.length > 0) result += ' ';
      result += `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    return result || '0 min'; // Fallback if no hours or minutes
  }
  getLastSegmentArrivalDetails(flight: any): any {
    const segments = flight.segments;
    if (!segments || segments.length === 0) {
      return null;
    }
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      const departCity = this.getCityName(segments[0].departure.iataCode);
      const arrivalCity = this.getCityName(lastSegment.arrival.iataCode);
      return {
        time: lastSegment.arrival.at,
        deapartureIataCode: departCity,
        deapartureTime: segments[0].departure.at,
        iataCode: arrivalCity
      };
    }
  }
  openSeatSelection(flight?: any) {
    this.isLoading = true;

    let flightValue = JSON.parse(JSON.stringify(this.flightDeatils[flight]));
    const seatSelected = this.selectedSeatsData[flight];
    this.flightService.seatSelection(flightValue).subscribe(result => {
      this.isLoading = false;
      const dialogRef = this.dialog.open(SelectSeatComponent, {
        width: '800px',
        data: {
          data1: result,
          data2: this.travellerType,
          data3: flightValue,
          data4: seatSelected,
          data5: this.showSeatSelection
        },
        panelClass: ['seatComponentpopup'],
      });
      dialogRef.afterClosed().subscribe(result => {
        if (Array.isArray(result)) {
          this.selectedSeatsData[flight] = result;
        this.updatedPrice = this.calculateTotalPrice(result);
          this.getAmountChange();
          const seatNumber: any[] = [];
          result.forEach(seatdata => {
            seatdata.forEach((seat: any) => {
              seatNumber.push(seat.number);
            })
          });
          this.selectedseatNumber[flight] = seatNumber;
        }
      });
    });

  
  }
  getCityName(iataCode: string): string | undefined {
    const city = this.cityDetail.find((city: any) => city.iataCode === iataCode);
    return city ? city.cityName : undefined;
  }
  calculateTotalPrice(data: any[]): number {
    let total = 0;
  
    // Iterate through the outer array
    data.forEach(innerArray => {
      // Iterate through each object in the inner array
      innerArray.forEach((item: { travelerPricing: any[]; }) => {
        // Check if travelerPricing exists and is an array
        if (item.travelerPricing && Array.isArray(item.travelerPricing)) {
          // Iterate through each pricing object
          item.travelerPricing.forEach(pricing => {
            // Check if price.total exists and is a valid number
            if (pricing.price && pricing.price.total) {
              total += parseFloat(pricing.price.total);
            }
          });
        }
      });
    });
  
    return total;
  }
}
