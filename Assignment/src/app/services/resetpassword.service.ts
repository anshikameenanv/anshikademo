import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  resetPassword(passwordData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/User/reset-password`, passwordData);
  }
 forgetPassword(email:any){
  return this.http.post<any>(`${this.apiUrl}/api/User/forgot-password`,email);
 }
}
