import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Please wait',
      text: 'Your information in being checked, please wait a moment',
      icon: 'info',
      showConfirmButton: false,
      timer: 45000,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
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
          Swal.fire({
            title: 'Success!',
            text: 'You logged in successfully!',
            icon: 'success',
            confirmButtonText: 'ok'
          });
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Oops',
            text: 'Your password or registration is wrong, please try again',
            icon: 'error',
            confirmButtonText: 'ok'
          });
        },
      });
  }
}
