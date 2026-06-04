import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProductDetails, IProductDetailsResponse, RestaurntService } from '../services/restaurnt-service';
import { CartService } from '../services/cart-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(RestaurntService);
  private cartService = inject(CartService);

  detailsData = signal<IProductDetailsResponse | undefined>(undefined);
  quantity = signal<number>(1);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.service.getProductById(+id).subscribe({
          next: (data) => {
            this.detailsData.set(data);
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const productId = this.detailsData()?.data.id;
    if (!productId) return;

    this.cartService
      .addToCart({
        productId: productId,
        quantity: this.quantity(),
      })
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            Swal.fire({
              title: 'Added!',
              text: 'Product added to cart successfully.',
              icon: 'success',
              confirmButtonColor: '#2e7d32'
            }).then(() => {
              this.router.navigate(['/cart']);
            });
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

  deleteFromCart(): void {
    const currentProductId = this.detailsData()?.data.id;
    if (!currentProductId) return;

    this.cartService.getCart().subscribe({
      next: (cartResult) => {
        const matchingCartItem = cartResult.data.items.find(
          (item) => item.product.id === currentProductId
        );

        if (!matchingCartItem) {
          Swal.fire({
            title: 'Not Found',
            text: 'This product is not present inside your cart.',
            icon: 'info',
            confirmButtonColor: '#3085d6'
          });
          return;
        }

        this.cartService.removeFromCart(matchingCartItem.id).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Removed!',
              text: 'Product removed from cart.',
              icon: 'warning',
              confirmButtonColor: '#c62828'
            }).then(() => {
              this.router.navigate(['/cart']);
            });
            this.quantity.set(1);
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
