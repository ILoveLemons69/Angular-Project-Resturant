import { Component, effect, inject, signal } from '@angular/core';
import { IProduct, IResponse, RestaurntService } from '../services/restaurnt-service';
import { Card } from '../card/card';
import { Filter } from '../filter/filter';

@Component({
  selector: 'app-products',
  imports: [Card, Filter],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private service = inject(RestaurntService);

  public products = signal<IProduct[] | undefined>(undefined);

  public page = signal<number>(1);
  public hasMore = signal<boolean>(false);
  public isFiltered = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (!this.isFiltered()) {
        this.getProducts();
      }
    });
  }

  getProducts() {
    this.service.getProducts(10, this.page()).subscribe({
      next: (data) => {
        this.products.set(data.data.products);
        this.hasMore.set(data.data.hasMore);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getFilteredData(response: IResponse) {
    this.products.set(response.data.products);
    this.hasMore.set(response.data.hasMore);
    this.isFiltered.set(true);
  }

  getNextPage() {
    if (this.hasMore()) {
      this.page.update((oldValue) => oldValue + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPreviousPage() {
    if (this.page() > 1) {
      this.page.update((oldValue) => oldValue - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
