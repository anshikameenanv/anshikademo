import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class WebcheckInService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  webCheckIn(airLineCode: any) {
    const encodedSearchTerm = encodeURIComponent(airLineCode);
    const baseUrl = `${this.apiUrl}/api/Airline/WebCheckIn`;
    const queryParams = `?airlineCode=${encodedSearchTerm}`;
    const url = baseUrl + queryParams;
    return this.http.post<any>(url, '');
  }

}
