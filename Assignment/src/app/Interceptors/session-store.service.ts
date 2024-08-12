import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStoreService {


  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');
    request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    if (token) {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;

      if (isExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('UserData');
        localStorage.removeItem('traveler');
     
      } else {
 
      }
    }
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (error: any) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {

          }
        }
      )
    );
  }
}
