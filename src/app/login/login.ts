import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private router = inject(Router);

  public loginForm = this.fb.group({
    email: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  public submit() {
    this.service
      .login({
        email: this.loginForm.controls.email.value ?? '',
        password: this.loginForm.controls.password.value ?? '',
      })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.service.storeJWTToken(data.data.accessToken);
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
