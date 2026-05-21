import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, ICartResult } from '../services/cart-service';
import { Card } from '../card/card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private cartService = inject(CartService);

  cartData = signal<ICartResult | undefined>(undefined);

  totalPhysicalItems = computed(() => {
    const items = this.cartData()?.data?.items ?? [];
    return items.reduce((sum, item) => sum + item.quantity, 0);
  });

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartData.set(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  processCheckout(): void {
    this.cartService.checkout(10, 1).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          Swal.fire({
            title: 'Success!',
            text: 'Your order has been checked out successfully.',
            icon: 'success',
            confirmButtonColor: '#2e7d32'
          });
          this.cartData.set(undefined);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
