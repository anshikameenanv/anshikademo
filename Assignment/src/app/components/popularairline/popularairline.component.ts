import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AirlineService } from 'src/app/services/airline.service';
import { DestinationService } from 'src/app/services/destination.service';
import { FlightsearchService } from 'src/app/services/flightsearch.service';

@Component({
  selector: 'app-popularairline',
  templateUrl: './popularairline.component.html',
  styleUrls: ['./popularairline.component.scss']
})
export class PopularairlineComponent {
  airLine: any;
  travelCombinations: any = [];
  showData: boolean = false;
  travelersCount: { adult: number; children: number; infantOnSeat: number, infantOnlap: number } = { adult: 1, children: 0, infantOnSeat: 0, infantOnlap: 0 };

  constructor(private airLineDetails: AirlineService, private flightSearch: FlightsearchService,private setflag :DestinationService) {
   this.setflag.setSelectedDestination(true);
  }

  selectedAirline(airline: any) {
    this.airLine = airline;

    const data = this.airLineDetails.getAirlineTravelDetails(airline);
    let nearAirportCityName = sessionStorage.getItem('NearestAirportCityName')?.replace(/"/g, '');
    let NearestAirportCityiataCode = sessionStorage.getItem('NearestAirportCityiataCode')?.replace(/"/g, '');
    if (nearAirportCityName == undefined) {
      nearAirportCityName = "New York";
      NearestAirportCityiataCode = "JFK"
    }
    for (var i = 0; i < data.data.length; i++) {
      0
      const airlinedata = data.data[i];
      const date = this.getRandomDateWithinOneMonth();
      const minFare = 400;
      const maxFare = 1000;
      this.showData = true;
      const randomFare = this.generateRandomFare(minFare, maxFare);
      this.travelCombinations.push({
        from: nearAirportCityName,
        cityName: airlinedata.name,
        iataCodeDeparture: NearestAirportCityiataCode,
        iataCodeArrival: airlinedata.iataCode,
        date: date,
        fare: randomFare
      });
    }

  }
  onSelectFlight(flightdata: any) {
    const searchData = {
      currencyCode: "USD",
      originDestinations: [
        {
          id: "1",
          originLocationCode: flightdata.iataCodeDeparture,
          destinationLocationCode: flightdata.iataCodeArrival,
          departureDateTimeRange: {
            date: this.formatDate(flightdata.date),
            time: this.formattime(flightdata.date)
          }
        }
      ],
      travelers: [{
        id: '1',
        travelerType: "ADULT",
      }],
      sources: [
        "GDS"
      ],
      searchCriteria: {
        maxFlightOffers: 50,
        nonStop: false,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: "ECONOMY",
              coverage: "MOST_SEGMENTS",
              originDestinationIds: [
                "1"
              ]
            }
          ]
        }
      }
    }
    this.flightSearch.getFlightSearchData(searchData).subscribe((data) => {
      //const formData = this.myForm.value;
      // this.flightSearch.setSearchData(data.data, formData, 0, [],this.travelersCount);
      // this.router.navigate(['/filter']);

    })
  }
  getRandomDateWithinOneMonth(): Date {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    const randomTimestamp = today.getTime() + Math.random() * (endDate.getTime() - today.getTime());
    const randomDate = new Date(randomTimestamp);

    return randomDate;
  }
  generateRandomFare(minFare: number, maxFare: number): number {
    if (minFare >= maxFare) {
      throw new Error('Minimum fare must be less than maximum fare.');
    }
    const randomFare = Math.random() * (maxFare - minFare) + minFare;
    return parseFloat(randomFare.toFixed(2));
  }

  formatDate(selectedDate: any) {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  formattime(selectedDate: any) {
    const date = new Date(selectedDate);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const formattedtime = `${hours}:${minutes}:${seconds}`;
    return formattedtime;

  }

}
