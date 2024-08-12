import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterrouteService {
  private jsonURL = 'data/airports.json';
  constructor(private http: HttpClient) { }

  getSearchFormData(goingTo: any, origin: any): any {

    const traveller = [{
      id: 1,
      travelerType: "ADULT",

    }]

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-CA');
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const formattedtime = `${hours}:${minutes}:${seconds}`;

    const searchData = {
      currencyCode: "USD",
      originDestinations: [
        {
          id: "1",
          originLocationCode: origin,
          destinationLocationCode: goingTo,
          departureDateTimeRange: {
            date: formattedDate,
            time: formattedtime
          }
        }
      ],
      travelers: traveller,
      sources: [
        "GDS"
      ],
      searchCriteria: {
        maxFlightOffers: 10,
        maxPrice:500,
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


    return searchData;
  }
  formatCityName(cityName: string): string {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  }
}
