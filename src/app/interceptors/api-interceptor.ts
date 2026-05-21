import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { environment } from '../../environments/environment.development';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const userSerice = inject(UserService);

  let newReq = req.clone({
    headers: req.headers.set('X-API-KEY', environment.api_key),
  });

  if (userSerice.getJWTToken() !== undefined && userSerice.getJWTToken() !== null) {
    newReq = newReq.clone({
      headers: newReq.headers.set('Authorization', `Bearer ${userSerice.getJWTToken()!}`),
    });

    return next(newReq);
  }

  return next(newReq);
};
