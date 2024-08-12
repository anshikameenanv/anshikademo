import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environment';
@Injectable({
  providedIn: 'root'
})

export class FlightsearchService {
  private searchDataSubject = new BehaviorSubject<any>(null);
  searchData$ = this.searchDataSubject.asObservable();
  private searchInputSubject = new BehaviorSubject<any>(null);
  searchInput$ = this.searchInputSubject.asObservable();
  private tabIndexSubject = new BehaviorSubject<any>(null);
  tabIndex$ = this.tabIndexSubject.asObservable();
  private multiDataSubject = new BehaviorSubject<any>(null);
  multiData$ = this.multiDataSubject.asObservable();
  private travelDataSubject = new BehaviorSubject<any>(null);
  travelData$ = this.travelDataSubject.asObservable();
  private bookingDataSubject = new BehaviorSubject<any>(null);
  bookingData$ = this.bookingDataSubject.asObservable();
  private paymentDataSubject = new BehaviorSubject<any>(null);
  paymentData$ = this.paymentDataSubject.asObservable();
  private apiUrl = environment.apiUrl;
  private reviewSubject = new BehaviorSubject<any>(null);
  reviewData$ = this.reviewSubject.asObservable(); 

  
  constructor(private http: HttpClient) { }

  getPaymentData(paymentData: any, travel: any) {
    this.paymentDataSubject.next(paymentData);
    this.travelDataSubject.next(travel);
 
  }
  getCheapeastFlight(data: any) {
    return this.http.post<any>(`${this.apiUrl}/api/FlightBookingEngine/FlightSearchAmadeus`, data);
  }

  createPaymentIntent(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Payment/createPaymentIntent`, payload);
  }

  getSuccessBookingData(response:any){
    this.reviewSubject.next(response);
  }

  
  setSearchData(searchdata: any, serachInput: any, tabIndex: any, multicity: any, flightInfo: any) {
    this.tabIndexSubject.next(tabIndex);
    this.searchInputSubject.next(serachInput);
    this.searchDataSubject.next(searchdata);
    this.multiDataSubject.next(multicity);
    this.travelDataSubject.next(flightInfo);
  }
  shareBookingdata(bookingData: any, travelInfo: any) {
    this.bookingDataSubject.next(bookingData);
    this.travelDataSubject.next(travelInfo)
  }
  getAirportDetails(city: string) {
    const encodedSearchTerm = encodeURIComponent(city);
    const baseUrl = `${this.apiUrl}/api/Airport/AirportSearch`;
    const queryParams = `?query=${encodedSearchTerm}`;
    const url = baseUrl + queryParams;
    return this.http.post<any>(url, '');
  }

  getFlightSearchData(searchData: any) {
    return this.http.post<any>(`${this.apiUrl}/api/FlightBookingEngine/FlightOffersSearch`, searchData);
  }
  getMultiCityFlightSearch(searchData: any) {
    return this.http.post<any>(`${this.apiUrl}/api/FlightBookingEngine/MultiCityFlightSearchAmadeus`, searchData);
  }

  getFlightOffers(searchData: any) {
    return this.http.post<any>(`${this.apiUrl}/api/FlightBookingEngine/FlightOffersPrice`, searchData);
  }
  getLocation() {
    return this.http.get('https://ipapi.co/json');
  }

  flightBooking(booking: any,sessionData:any) {
    const encodedSearchTerm = encodeURIComponent(sessionData);
    const baseUrl = `${this.apiUrl}/api/FlightBookingEngine/SaveFlightOrder`;
    const queryParams = `?sessionId=${encodedSearchTerm}`;
    const url = baseUrl + queryParams;
    return this.http.post<any>(url, booking);
  }
  NearestAirport(locationCode: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Airport/NearestAirport`, locationCode);
  }
  seatSelection(flightData:any){
    return this.http.post<any>(`${this.apiUrl}/api/FlightSeatMap/FlightSeatMaps`, flightData);
  }

  confirmBooking(sessionId:any,userId?:any){
    const encodedSearchTerm = encodeURIComponent(sessionId);

    if(userId){
      const encodedSearchId = encodeURIComponent(userId);
      const baseUrl = `${this.apiUrl}/api/FlightBookingEngine/IsBookingConfirmed`;
      const queryParams = `?sessionId=${encodedSearchTerm}&userId=${encodedSearchId}`;
      const url = baseUrl + queryParams;
      return this.http.post<any>(url,'');
    }
    else{
      const baseUrl = `${this.apiUrl}/api/FlightBookingEngine/IsBookingConfirmed`;
      const queryParams = `?sessionId=${encodedSearchTerm}`;
      const url = baseUrl + queryParams;
      return this.http.post<any>(url,''); 
    }
  }

  topMostDestination(flightData:any){
    return this.http.post<any>(`${this.apiUrl}/api/FlightInspiration/USATopDestination`,flightData);
  }
}
