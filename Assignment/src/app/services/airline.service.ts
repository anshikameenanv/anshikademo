import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class AirlineService {
airLine:any;
private apiUrl = environment.apiUrl;



webCheckIn(airLineCode: any) {
  const encodedSearchTerm = encodeURIComponent(airLineCode);
  const baseUrl = `${this.apiUrl}/api/Airline/WebCheckIn`;
  const queryParams = `?airlineCode=${encodedSearchTerm}`;
  const url = baseUrl + queryParams;
  return this.http.post<any>(url, '');
}

   constructor(private http: HttpClient) {
    this.airLine={

      "data": [
        {
          "type": "location",
          "subtype": "city",
          "name": "ALBUQUERQUE",
          "iataCode": "ABQ",
          "geoCode": {
            "latitude": 35.04195,
            "longitude": -106.6069
          },
          "address": {
            "countryName": "UNITED STATES OF AMERICA",
            "countryCode": "US",
            "stateCode": "NM",
            "regionCode": "NAMER"
          },
          "timeZone": {
            "offSet": "-06:00",
            "referenceLocalDateTime": "2024-05-01T12:10:19"
          }
        },
        {
          "type": "location",
          "subtype": "city",
          "name": "NANTUCKET",
          "iataCode": "ACK",
          "geoCode": {
            "latitude": 41.25306,
            "longitude": -70.06027
          },
          "address": {
            "countryName": "UNITED STATES OF AMERICA",
            "countryCode": "US",
            "stateCode": "MA",
            "regionCode": "NAMER"
          },
          "timeZone": {
            "offSet": "-04:00",
            "referenceLocalDateTime": "2024-05-01T12:10:19"
          }
        },
        {
          "type": "location",
          "subtype": "city",
          "name": "ALBANY",
          "iataCode": "ALB",
          "geoCode": {
            "latitude": 42.74834,
            "longitude": -73.80166
          },
          "address": {
            "countryName": "UNITED STATES OF AMERICA",
            "countryCode": "US",
            "stateCode": "NY",
            "regionCode": "NAMER"
          },
          "timeZone": {
            "offSet": "-04:00",
            "referenceLocalDateTime": "2024-05-01T12:10:19"
          }
        },
        {
          "type": "location",
          "subtype": "city",
          "name": "ATLANTA",
          "iataCode": "ATL",
          "geoCode": {
            "latitude": 33.64112,
            "longitude": -84.42277
          },
          "address": {
            "countryName": "UNITED STATES OF AMERICA",
            "countryCode": "US",
            "stateCode": "GA",
            "regionCode": "NAMER"
          },
          "timeZone": {
            "offSet": "-04:00",
            "referenceLocalDateTime": "2024-05-01T12:10:19"
          }
        },
        {
          "type": "location",
          "subtype": "city",
          "name": "AUGUSTA",
          "iataCode": "AUG",
          "geoCode": {
            "latitude": 44.32056,
            "longitude": -69.79722
          },
          "address": {
            "countryName": "UNITED STATES OF AMERICA",
            "countryCode": "US",
            "stateCode": "ME",
            "regionCode": "NAMER"
          },
          "timeZone": {
            "offSet": "-04:00",
            "referenceLocalDateTime": "2024-05-01T12:10:19"
          }
        }
      ]
    }
    }
 

  getAirlineTravelDetails(airLineCode: any) {
    return this.airLine;
  }
  getAirLineIcon(airLineCode:any){
    const encodedSearchTerm = encodeURIComponent(airLineCode);
    const baseUrl = `${this.apiUrl}/api/Logo/FlightLogo`;
    const queryParams = `?flightCode=${encodedSearchTerm}`;
    const url = baseUrl + queryParams;
    return this.http.get<any>(url);
  }
}
