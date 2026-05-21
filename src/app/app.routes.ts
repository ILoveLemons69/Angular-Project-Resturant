import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Cart } from './cart/cart';
import { Login } from './login/login';
import { Register } from './register/register';
import { Products } from './products/products';
import { ProductDetails } from './product-details/product-details';
import { Profile } from './profile/profile';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'menu',
    component: Products,
  },
  {
    path: 'menu/:id',
    component: ProductDetails,
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
