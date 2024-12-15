import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const listOfErrors = new Array(401, 403);
      if (listOfErrors.indexOf(error.status) > -1) {
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
