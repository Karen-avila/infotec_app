import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Storage } from '@ionic/storage';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '@env';
import { timeout } from 'rxjs/operators';
import { AuthenticationService } from '@services/user/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private storage: Storage, 
    private authentication: AuthenticationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let request: HttpRequest<any> = req;
    let headers = {
      'Content-Type': 'application/json'
    };

    if (environment.graviteeEndpoints) {
      if (/\/otp\//g.test(req.url)) {
        headers['X-Gravitee-Api-Key'] = environment.totpGraviteeApiKey;
      } else if (/\/banbi\//g.test(req.url)) {
        headers['X-Gravitee-Api-Key'] = environment.banbiGraviteeApiKey;
      } else {
        headers['X-Gravitee-Api-Key'] = environment.graviteeApiKey;
      }
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
                  this.authentication.logout();
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
