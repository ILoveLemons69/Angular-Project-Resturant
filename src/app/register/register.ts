import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private router = inject(Router);

  public registerForm = this.fb.group({
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  public submit() {
    if (this.registerForm.invalid) {
      return;
    }
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
      .register({
        firstName: this.registerForm.controls.firstName.value ?? '',
        lastName: this.registerForm.controls.lastName.value ?? '',
        email: this.registerForm.controls.email.value ?? '',
        password: this.registerForm.controls.password.value ?? '',
      })
      .subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Verify Your Email',
            text: 'We have sent a verification link to your email address. Please check your inbox and confirm your account before logging in.',
            icon: 'info',
            confirmButtonColor: '#fd7e14',
            confirmButtonText: 'Go to Login',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Registration Failed',
            text: error.error?.message || 'An error occurred during registration.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
        },
      });
  }
}
