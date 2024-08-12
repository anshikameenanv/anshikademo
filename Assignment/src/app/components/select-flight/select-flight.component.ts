import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-flight',
  templateUrl: './select-flight.component.html',
  styleUrls: ['./select-flight.component.scss']
})
export class SelectFlightComponent {
  isActive = false;
  fareDetailsWithSegmentAndPriceData: any = [];
  flightIndex: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public flightData: any, private dialogRef: MatDialogRef<SelectFlightComponent>) { }
  flightInfo!: string;
  cityDetail:any=[];
ametitesArray:any=[];
bagAmenities: any[] = [];
mealAmenities: any[] = [];
seatAmenities: any[] = [];
  ngOnInit() {
    let flightOffer: any;
    if (this.flightData.data1.data) {

      this.cityDetail.push(...this.flightData.data1.data.data.arrivalCitys);
      this.cityDetail.push(...this.flightData.data1.data.data.departureCitys);
      flightOffer = this.flightData.data1.data.data.flightOffers[0];
    } else {
      flightOffer = this.flightData.data1.flightOffers[0];
    }

    // const flightOffer: any = this.flightData.data1.data.data.flightOffers[0];
    const travelerPricings: any = flightOffer.travelerPricings;
    const itineraries: any = flightOffer.itineraries;
    if (travelerPricings && travelerPricings.length > 0) {
      const pricing = { ...travelerPricings[0] };

      const fareDetailsWithSegmentAndPrice = pricing.fareDetailsBySegment.map((fareDetail: any) => {
        const segment = itineraries[0].segments.find((segment: any) => segment.id === fareDetail.segmentId);
        if (segment) {
          let airLines;
          if(this.flightData.data1.data){
             airLines=this.flightData.data1.data.data.airlines
          }else{
             airLines=this.flightData.data1.airlines
          }
          return { ...fareDetail, segment, price: pricing.price, pricingOptions: flightOffer.pricingOptions, airLines: airLines };
        }
      });
      const filteredArray = fareDetailsWithSegmentAndPrice.filter((value: any) => value !== null && value !== undefined);
      this.fareDetailsWithSegmentAndPriceData = filteredArray;
    }

this.ametitesArray=this.getAmenities(this.flightData.amenities);
    this.organizeAmenities();


  }// Function to calculate layover time
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

// Function to get layover info for a segment
getLayoverInfo(segment: any): string {
  const index = this.fareDetailsWithSegmentAndPriceData.indexOf(segment);
  if (index < 0 || index >= this.fareDetailsWithSegmentAndPriceData.length - 1) {
    return ''; // No layover if index is invalid or last segment
  }

  const arrivalTime = this.fareDetailsWithSegmentAndPriceData[index].segment.arrival.at;
  const departureTime = this.fareDetailsWithSegmentAndPriceData[index + 1].segment.departure.at;

  return this.getLayoverTime(arrivalTime, departureTime);
}


  getAmenities(flightOffer: any): { isChargeable: boolean, amenityType: string, description: string }[] {
    debugger;
    const amenities: { isChargeable: boolean, amenityType: string, description: string }[] = [];
  

    if (flightOffer.travelerPricings && flightOffer.travelerPricings.length > 0) {

      const firstTravelerPricing = flightOffer.travelerPricings[0];
  
      if (firstTravelerPricing.fareDetailsBySegment && firstTravelerPricing.fareDetailsBySegment.length > 0) {
  
        const firstFareDetail = firstTravelerPricing.fareDetailsBySegment[0];
  
    
        const filteredAmenities = firstFareDetail.amenities.map((amenity: any) => ({
          isChargeable: amenity.isChargeable,
          amenityType: amenity.amenityType,
          description: amenity.description
        }));
  
        amenities.push(...filteredAmenities);
      }
    }
  
    return amenities;
  }
  
  

  organizeAmenities() {
    this.bagAmenities = this.ametitesArray.filter((a:any) => a.amenityType === 'BAGGAGE');
    this.mealAmenities = this.ametitesArray.filter((a:any) => a.amenityType === 'MEAL');
    this.seatAmenities = this.ametitesArray.filter((a:any) => a.amenityType === 'PRE_RESERVED_SEAT');
  }
  toggleClass(): void {
    this.isActive = !this.isActive;
  }
  selectedFlight(data: any) {
    if (data == 'selected') {
      this.dialogRef.close('selected');
    }
    else {
      this.dialogRef.close('close');
    }
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
  getAirlineCommonNameFromSegment(segment: any): string | null {
    const airlines = segment.airLines;
    if (!segment || !segment.segment.carrierCode || !airlines || airlines.length === 0) {
      return null;
    }
    const airline = airlines.find((airline: any) => airline.carrierCode === segment.segment.carrierCode);
    return airline ? airline.commonName : null;
  }
  getCityName(iataCode: string): string | undefined {
   
    const city = this.cityDetail.find((city:any) => city.iataCode === iataCode);

    return city ? city.cityName : undefined;
}
}
