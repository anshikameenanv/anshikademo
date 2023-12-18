
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DealerService {


  private apiUrl = 'http://localhost:3000/dealers';
 

  constructor(private http: HttpClient) {
    
  }

  
  addCar(dealerId: any, car: any): Observable<any> {
    console.log(dealerId);
    const url = `http://localhost:3000/dealers/${dealerId}/cars`;
    return this.http.post(url, car);
  }
    getDealerById(id: number): Observable<any> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<any>(url);
    }
  

  getDealers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addDealer(newDealer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newDealer);
  }
  updateDealer(dealer: any): Observable<any> {
    const url = `${this.apiUrl}/${dealer.id}`;
    return this.http.put<any>(url, dealer);
  }

  deleteDealer(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }


}