import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IUser } from './user-service';

export interface IResponse {
  data: {
    hasMore: boolean;
    products: IProduct[];
  };
}

export interface IProduct {
  canDelete?: boolean;
  description: string;
  id: number;
  image: string;
  name: string;
  price: number;
  rate: number;
  spiciness: number;
  vegeterian: number;
}

export interface IResponse {
  data: {
    hasMore: boolean;
    products: IProduct[];
  };
}

export interface IProductDetailsResponse {
  data: IProductDetails;
  meta: {
    name: string;
    description: string;
    website: string;
    location: string;
    email: string;
  };
}

export interface IProductDetails {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;
  description: string;

  vegetarian: boolean;
  spiciness: number;
  rate: number;
  price: number;

  image: string;
  method: string;

  ingredients: string[];

  isUserCreated: boolean;
  key: string;

  categoryId: number;
  category: ICategory;

  items: IItem[];

  canDelete?: boolean;
}

export interface ICategory {
  id: number;
  createdAt: string;
  updatedAt: string;

  name: string;

  isUserCreated: boolean;
  key: string;

  products: string[];
}

export interface IItem {
  id: number;
  createdAt: string;
  updatedAt: string;

  quantity: number;

  userId: number;
  user: IUser;
}

export interface IFilter {
  query?: string;
  vegetarian?: boolean;
  spiciness?: number;
  rate?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  take?: number;
  page?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurntService {
  private http = inject(HttpClient);

  public getProducts(take = 10, page = 1): Observable<IResponse> {
    return this.http.get<IResponse>(`${environment.baseUrl}/products`, {
      params: { take: take, page: page },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public getProductById(id: number): Observable<IProductDetailsResponse> {
    return this.http.get<IProductDetailsResponse>(`${environment.baseUrl}/products/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public getFiltered(filter: IFilter): Observable<IResponse> {
    let params = new HttpParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.http.get<IResponse>(`${environment.baseUrl}/products/filter`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
