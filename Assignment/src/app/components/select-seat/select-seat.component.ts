import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-select-seat',
  templateUrl: './select-seat.component.html',
  styleUrls: ['./select-seat.component.scss']
})
export class SelectSeatComponent {
  numberOfTravelers: number = 1;
  allSeats: any = [];
  showSelectSeatButton: boolean = false;
  cityDetail: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SelectSeatComponent>, private snackBar: MatSnackBar) { }
  isClassActive: boolean = true;
  selectedValue: string | undefined;
  widthOfSeat: number = 0;
  lengthOfSeat: number = 0;
  seatDummy: any = [];
  seatSelected: any = [];
  seatsData: Seat[] = [];
  seats: (Seat | null)[][] | undefined;
  selectedSeat: any[][] = [];
  flightData: any = [];
  selectedOption: string = '';
  seatData: any[][] = [];
  flightIndex: number = 1;
  selectedIndex: number = 0;
  disableSeat: boolean = true;


  ngOnInit(): void {
    const travellerType = this.data.data2;
    this.numberOfTravelers = travellerType.adult + travellerType.children + travellerType.infantOnSeat;
    this.showSelectSeatButton = this.data.data5;
    if (this.data.data1.data.length > 0 && this.data.data1.data != undefined && this.data.data1.data != null) {
      if (this.data.data4 !== undefined && this.data.data4.length > 0) {
        this.seatSelected = this.data.data4;
        this.selectedSeat.push(...this.seatSelected);
      }

      this.flightData = this.data.data3
      this.cityDetail.push(...this.flightData.departureCitys);
      this.cityDetail.push(...this.flightData.arrivalCitys);
      for (var i = 0; i < this.flightData.itineraries[0].segments.length; i++) {
        const departureLocation = this.getCityName(this.flightData.itineraries[0].segments[i].departure.iataCode);
        const arrivalLocation = this.getCityName(this.flightData.itineraries[0].segments[i].arrival.iataCode);
        this.options.push({ index: i, value: `${departureLocation} to ${arrivalLocation}`, viewValue: `${departureLocation} to ${arrivalLocation}` })
      }

      this.selectedOption = this.options[0].value;
   

      for (let i = 0; i < this.options.length; i++) {
        this.selectedSeat[i] = [];
      }
      if (this.seatSelected.length > 0) {
        for (let i = 0; i < this.seatSelected.length; i++) {
          this.selectedSeat[i].push(...this.seatSelected[i]);
        }
      }

      for (var i = 0; i < this.data.data1.data.length; i++) {
        const lengthOfSeat = this.data.data1.data[i].decks[0].lengthOfSeat;
        const widthOfSeat = this.data.data1.data[i].decks[0].widthOfSeat;
        const seatDataFlight = this.data.data1.data[i].decks[0].seats;
        const seatMap = this.generateSeatMap1(lengthOfSeat, widthOfSeat, seatDataFlight);
        this.seatData.push(seatMap);
      }
      this.seatDummy = this.seatData[0];
    }

  }

  options: { index: number, value: string, viewValue: string }[] = []
  removeClass() {
    this.isClassActive = false;
  }

  generateSeatMap1(lengthSeat: any, widthOfSeat: any, seatData: any): any[][] {
    const seatMap: any[][] = [];
    for (let i = 0; i < lengthSeat; i++) {
      const row: any[] = [];
      const index = i + 1;
      for (let j = 0; j < widthOfSeat; j++) {

        const data = this.getSeatData1(index, j, seatData);


        row.push(data);
      }
      seatMap.push(row);
    }
    return seatMap;
  }
  getSeatData1(x: number, y: number, SeatData: any): any | null {
    for (const seatData of SeatData) {
      if (seatData.cordinates.x === x && seatData.cordinates.y === y) {
        return seatData;
      }
    }
    return null;
  }

  onOptionSelectionChange(event: any): void {
    const index = this.options.findIndex(option => option.value === event);
    if (this.seatData[index] != undefined && this.seatData[index].length > 0) {
      this.seatDummy = this.seatData[index];
      this.flightIndex = this.options[index].index + 1;
      this.selectedIndex = this.options[index].index,
        this.selectedOption = this.options[index].value;
    }
    else {
      this.seatDummy = [];
      this.selectedSeatClose('no seat available');
      this.flightIndex = this.options[index].index + 1;
      this.selectedIndex = this.options[index].index,
        this.selectedOption = this.options[index].value;
    }
  }
  selectedSeatClose(data?: any, selectedIndex?: any) {

    if (data == 'selected') {
      const index = selectedIndex + 1;

      if (index == this.options.length) {
        this.dialogRef.close(this.selectedSeat);
      }
      else {
    
        const option = this.options[index].value;
        this.selectedOption = this.options[index].value;
        if (this.selectedSeat[index].length == this.numberOfTravelers) {
          this.disableSeat = false;
        }
        else {
          this.disableSeat = true;
        }
        this.onOptionSelectionChange(option);
      }

    }
    else if(data == 'no seat available'){
      this.dialogRef.close(this.selectedSeat);
    }
    else {
      this.dialogRef.close('close');
    }
  }

  getTooltipText(seat: any): string {
    if (seat && seat.travelerPricing && seat.travelerPricing.length > 0 && seat.travelerPricing[0].seatAvailabilityStatus === 'AVAILABLE') {
      const pricing = seat.travelerPricing[0];
      return `Seat Number: ${seat.number}, Price: ${pricing.price.total} ${pricing.price.currency}`;
    } else if (seat && seat.travelerPricing && seat.travelerPricing.length > 0) {
      // Seat is not available
      return `Seat Number: ${seat.number}, Not Available`;
    } else {
      // Seat is null or doesn't have pricing information
      return '';
    }
  }
  getBorder(seat: any): any {
    if (seat) {
      const ExitRow = seat.characteristicsCodes && seat.characteristicsCodes.includes("E");
      if (ExitRow) {
        return 'solid'
      }
      else {
        'none'
      }
    }
  }
  getSeatBackgroundColor(seat: any, selectedIndex: any): string {
    if (this.isSelected(seat, selectedIndex)) {
      return 'yellow'; // Change to whatever color you prefer for selected seats
    }
    else {
      if (seat && seat.travelerPricing && seat.travelerPricing.length > 0) {
        const pricing = seat.travelerPricing[0]; // Assuming there is only one pricing object
        const hasLegSpace = seat.characteristicsCodes && seat.characteristicsCodes.includes("L");
        const offeredLast = seat.characteristicsCodes && seat.characteristicsCodes.includes("Seat to be left vacant or offered last");

        if (pricing.seatAvailabilityStatus === "AVAILABLE") {
          if (offeredLast) {
            return 'lightgray'; // Available seat color when offered last
          } else if (hasLegSpace) {
            if (parseFloat(pricing.price.total) > 100) {
           
              return  '#efb6ec'; // Available, leg space, and price > 100 color
            } else {
            
              return '#efb6ec'; // Available and leg space seat color
            }
          } else {
            if (parseFloat(pricing.price.total) > 100) {
              return '#f1b0f1'; // Available and price > 100 color
            } else {
              return 'lightblue'; // Available seat color
            }
          }
        } else if (offeredLast) {
          return 'lightgray'; // Offered last but not available
        } else {
          return 'lightgray'; // Unavailable seat color
        }
      } else {
        return 'transparent'; // Default background color
      }
    }

  }
  getCityName(iataCode: string): string | undefined {

    const city = this.cityDetail.find((city: any) => city.iataCode === iataCode);

    return city ? city.cityName : undefined;
  }
  selectSeat(seat: any, index: any) {
    const pricing = seat.travelerPricing[0]; // Assuming there is only one pricing object
    if (pricing.seatAvailabilityStatus == "AVAILABLE") {
      const indexAt = index - 1;

      if (seat != null) {


        const seatIndex = this.findElementIndex(this.selectedSeat, indexAt);

        if (seatIndex === -1) {

          if (this.selectedSeat[indexAt] && this.selectedSeat[indexAt].length >= this.numberOfTravelers) {
            // Your logic here
            this.selectedSeat[indexAt].splice(0, 1);

          }

          this.selectedSeat[indexAt].push(seat);
          if (this.selectedSeat[indexAt].length == this.numberOfTravelers) {
            this.disableSeat = false;
          }

        } else {
          this.selectedSeat[indexAt].splice(seatIndex, 1);
        }
      }
    }
  }

  findElementIndex(arr: any[][], element: any): number {
    return arr.findIndex(innerArray => innerArray.includes(element));
  }

  isSelected(seat: any, index?: any): boolean {
    return this.selectedSeat[index].includes(seat);
  }

}
interface Seat {
  cabin: string;
  number: string;
  cordinates: { x: number; y: number };
  characteristicsCodes: string[];
  travelerPricing: { seatAvailabilityStatus: string; price: { currency: string; total: string } }[];
}

