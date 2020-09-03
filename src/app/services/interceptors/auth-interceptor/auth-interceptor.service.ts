import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '@env';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private storage: Storage, 
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let request: HttpRequest<any> = req;
    let headers = {
      'Content-Type': 'application/json'
    };

    if (environment.production) {
      headers['X-Gravitee-Api-Key'] = /\/otp\//g.test(req.url) ? environment.totpGraviteeApiKey : environment.graviteeApiKey
    } else {
      headers['Fineract-Platform-TenantId'] = 'default';
    }

    request = request.clone({
      setHeaders: headers
    });

    return from(this.storage.get('token'))
      .pipe(
        switchMap( token => {

          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Basic ${token}`
              }
            });
          }

          return next.handle(request).pipe(
            timeout(30000),
            catchError((err: HttpErrorResponse) => {

              console.log(err);

              switch(err.status) {
                case 401: 
                  this.router.navigateByUrl('/login');
                  break; 
                case 504: 
                  // this.helpersService.showNoInternet();
                  break;
                default: 
                  break;
              }
      
              return throwError( err );
      
            })
          );
        })
      );
  }
}
