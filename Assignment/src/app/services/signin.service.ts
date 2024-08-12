import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class SigninService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  adminLogging(logingData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/User/login`, logingData);
  }
  signUp(userData:any){
    return this.http.post<any>(`${this.apiUrl}/api/User/AddUser`, userData);
  
  }
}
