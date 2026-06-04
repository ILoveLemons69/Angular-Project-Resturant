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
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    phoneNumber: this.fb.control(''),
    address: this.fb.control(''),
    age: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(120)])
  });

  public submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
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

    const registeredEmail = this.registerForm.controls.email.value ?? '';
    const phoneString = this.registerForm.controls.phoneNumber.value ?? '';
    const addressString = this.registerForm.controls.address.value ?? '';
    const ageValue = this.registerForm.controls.age.value ? Number(this.registerForm.controls.age.value) : 18;

    this.service
      .register({
        firstName: this.registerForm.controls.firstName.value ?? '',
        lastName: this.registerForm.controls.lastName.value ?? '',
        email: registeredEmail,
        password: this.registerForm.controls.password.value ?? '',
        phoneNumber: phoneString,
        address: addressString,
        age: ageValue,
      })
      .subscribe({
        next: (data: any) => {
          if (phoneString) localStorage.setItem(`${registeredEmail}_phone`, phoneString);
          if (addressString) localStorage.setItem(`${registeredEmail}_address`, addressString);
          localStorage.setItem(`${registeredEmail}_age`, ageValue.toString());

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
        error: (error: any) => {
          Swal.fire({
            title: 'Registration Failed',
            text: error.error?.detail || error.error?.message || 'An error occurred during registration.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
        },
      });
  }
}
