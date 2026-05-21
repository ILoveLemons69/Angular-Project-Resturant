import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  }

  Swal.fire({
    title: 'Access Denied',
    text: 'You must be logged in to view your shopping cart.',
    icon: 'warning',
    confirmButtonColor: '#fd7e14',
    confirmButtonText: 'Go to Login'
  }).then(() => {
    router.navigate(['/login']);
  });

  return false;
};
