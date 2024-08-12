import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  destinationsData =
  [
    {
      "name": "JOHN F KENNEDY INTL",
      "iataCode": "JFK",
      "cityName": "NEW YORK",
      "cityCode": "NYC",
      "countryName": "UNITED STATES OF AMERICA",
      "countryCode": "US",

    },
    {
      "name": "HARRY REID INTL",
      "iataCode": "LAS",
      "cityName": "LAS VEGAS",
      "cityCode": "LAS",
      "countryName": "UNITED STATES OF AMERICA",
      "countryCode": "US",

    },
    {
      "name": "O HARE INTERNATIONAL",
      "iataCode": "ORD",
      "cityName": "CHICAGO",
      "cityCode": "CHI",
      "countryName": "UNITED STATES OF AMERICA",
      "countryCode": "US",

    },
    {
      "name": "LOS ANGELES INTL",
      "iataCode": "LAX",
      "cityName": "LOS ANGELES",
      "cityCode": "LAX",
      "countryName": "UNITED STATES OF AMERICA",
      "countryCode": "US",

    },
 
    {
      "name": "MIAMI INTL",
      "iataCode": "MIA",
      "cityName": "MIAMI",
      "cityCode": "MIA",
      "countryName": "UNITED STATES OF AMERICA",
      "countryCode": "US",

    },
    {
      "name": "EXECUTIVE",
      "iataCode": "ORL",
      "cityName": "ORLANDO",
      "cityCode": "ORL",
      "countryName": "UNITED STATES OF AMERICA",
      "countryCode": "US",

    }
  ]
dummyData = {

  "name": "EDWARD L LOGAN INTL",
  "iataCode": "BOS",
  "cityName": "BOSTON",
  "cityCode": "BOS",
  "countryName": "UNITED STATES OF AMERICA",
  "countryCode": "US",

};
  constructor() { }
}
