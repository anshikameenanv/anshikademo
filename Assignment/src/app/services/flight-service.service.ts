import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightServiceService {

  // private apiUrl = 'https://localhost:7165/api/PaymentGateway';
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  sendFormData(amount: any): Observable<any> {
    const params = new HttpParams().set('amount', amount.toString()); 
    return this.http.post<any>(`${this.apiUrl}/api/PaymentGateway/PaymentGateway`, null, { params });
  }
} 
 