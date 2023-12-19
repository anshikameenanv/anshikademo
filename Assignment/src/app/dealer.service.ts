
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
  deleteCar(carId: any){
 
    return this.http.delete<any>(`http://localhost:3000/cars/${carId}`);
  
  }
  addCar(dealerId: any, carDetails: any): Observable<any> {
    const carWithDealerId = { ...carDetails, dealerId };
    return this.http.post<any>(`http://localhost:3000/cars`, carWithDealerId);
  }
  
    getDealerById(id: number): Observable<any> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<any[]>(`http://localhost:3000/cars?dealerId=${id}`);
      
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