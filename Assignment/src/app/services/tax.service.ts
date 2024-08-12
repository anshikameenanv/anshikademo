import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getTaxAmount(amount: any) {
    return this.http.get(`${this.apiUrl}/api/ConfigTax/GetCalculatedTax?amount=${amount}`);
  }
}
