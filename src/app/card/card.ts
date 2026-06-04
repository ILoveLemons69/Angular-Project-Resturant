import { Component, inject, input, output, signal } from '@angular/core';
import { IProduct } from '../services/restaurnt-service';
import { CartService, ICartItem } from '../services/cart-service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  private cartService = inject(CartService);

  public cardData = input<IProduct>();
  public cartItemData = input<ICartItem>();
  public itemRemoved = output<boolean>();

  quantity = signal<number>(1);

  public incrementQuantity() {
    this.quantity.update((q) => q + 1);
  }

  public decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  public showDescription(name: string, description: string) {
    Swal.fire({
      title: name,
      text: description,
      icon: 'info',
      confirmButtonColor: '#0d6efd'
    });
  }

  public addToCart(id: number) {
    const targetQty = this.quantity();
    this.cartService.addToCart({ productId: id, quantity: targetQty }).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          Swal.fire({
            title: 'Added!',
            text: `${targetQty} item(s) added to cart.`,
            icon: 'success',
            confirmButtonColor: '#198754'
          });
          this.quantity.set(1);
          this.itemRemoved.emit(true);
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'warning',
          title: 'Login required',
          text: 'You have to log in before making a purchase.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        console.error(error);
      },
    });
  }

  public removeFromCart(id: number) {
    this.cartService.removeFromCart(id).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Removed!',
          text: 'Product removed from cart.',
          icon: 'warning',
          confirmButtonColor: '#dc3545'
        });
        this.itemRemoved.emit(true);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
