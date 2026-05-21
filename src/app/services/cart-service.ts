import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IProduct } from './restaurnt-service';

export interface ICartItem {
  id: number;
  quantity: number;
  product: IProduct;
}

export interface ICartResult {
  data: {
    items: ICartItem[];
    totalItems: number;
    totalPrice: number;
  };
}

export interface IResponse {
  isSuccess: boolean;
  error: {
    message: string;
    statusCode: number;
  };
}

export interface IAddToCart {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  public getCart(): Observable<ICartResult> {
    return this.http.get<ICartResult>(`${environment.baseUrl}/cart`);
  }

  public addToCart(data: IAddToCart): Observable<IResponse> {
    return this.http.post<IResponse>(`${environment.baseUrl}/cart/add-to-cart`, data);
  }

  public removeFromCart(id: number): Observable<IResponse> {
    return this.http.delete<IResponse>(`${environment.baseUrl}/cart/remove-from-cart/${id}`);
  }

  public checkout(take: number = 10, page: number = 1): Observable<IResponse> {
    return this.http.post<IResponse>(
      `${environment.baseUrl}/cart/checkout`,
      null,
      {
        params: {
          Take: take.toString(),
          Page: page.toString()
        }
      }
    );
  }
}
