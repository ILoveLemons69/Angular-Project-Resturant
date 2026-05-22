import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private service = inject(UserService);
  isLoggedIn = computed<boolean>(this.service.isLoggedIn);
  isMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMenuOpen.update((state) => !state);
  }

  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#cf1414',
      confirmButtonColor: 'green',
      confirmButtonText: 'yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.logout();
        this.isMenuOpen.set(false);
      }
    })
  }
}