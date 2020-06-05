import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, forkJoin } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { catchError, mergeMap, map, switchMap } from 'rxjs/operators';
import { HelpersService } from '@services/helpers/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private storage: Storage, 
    private router: Router,
    private helpersService: HelpersService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let request: HttpRequest<any> = req;

    request = request.clone({
      setHeaders: {
        'Fineract-Platform-TenantId': 'default',
        'Content-Type': 'application/json'
      }
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
            catchError((err: HttpErrorResponse) => {

              console.log(err);

              switch(err.status) {
                case 401: 
                  this.router.navigateByUrl('/login');
                  break; 
                case 504: 
                  this.helpersService.showNoInternet();
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