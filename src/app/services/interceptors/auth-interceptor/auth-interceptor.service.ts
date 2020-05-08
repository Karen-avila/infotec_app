import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, forkJoin } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { catchError, mergeMap, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private storage: Storage, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let request: HttpRequest<any> = req;

    request = request.clone({
      setHeaders: {
        'Fineract-Platform-TenantId': 'tebancamos-c9affe7f758',
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
      
              if (err.status === 401) {
                this.router.navigateByUrl('/login');
              }
      
              return throwError( err );
      
            })
          );
        })
      );
  }
}
