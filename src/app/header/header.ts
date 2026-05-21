import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user-service';

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
    this.service.logout();
    this.isMenuOpen.set(false);
  }
}