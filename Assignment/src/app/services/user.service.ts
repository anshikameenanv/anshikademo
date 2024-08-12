import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
 
  
  constructor(private http: HttpClient) { }
  getUser(userId:any){
    return this.http.get(`${this.apiUrl}/api/User/GetUserById/${userId}`);
  }
  getUserBookingDetails(userId:any){
    return this.http.get(`${this.apiUrl}/api/BookingHistory/${userId}`);
  }
  updateUser(userId:any,userData:any){
    return this.http.put(`${this.apiUrl}/api/User/UpdateUser/${userId}`,userData);
  }
}
