import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  userData = signal<any>(undefined);

  passwordForm = this.fb.group({
    currentPassword: this.fb.control('', [Validators.required]),
    newPassword: this.fb.control('', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/[!@#$%^&*(),.?":{}|<>]/)
    ]),
    confirmPassword: this.fb.control('', [Validators.required])
  });

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.userData.set(res.data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    if (this.passwordForm.controls.newPassword.value !== this.passwordForm.controls.confirmPassword.value) {
      Swal.fire({
        title: 'Mismatch',
        text: 'New password and confirmation password do not match.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
      return;
    }

    this.userService.changePassword({
      oldPassword: this.passwordForm.controls.currentPassword.value,
      newPassword: this.passwordForm.controls.newPassword.value,
      confirmPassword: this.passwordForm.controls.confirmPassword.value
    }).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been changed successfully.',
          icon: 'success',
          confirmButtonColor: '#fd7e14'
        });
        this.passwordForm.reset();
      },
      error: (err) => {
        Swal.fire({
          title: 'Validation Error',
          text: err.error?.detail || 'Failed to alter password.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  deleteProfile(): void {
    Swal.fire({
      title: 'Are you absolutely sure?',
      text: 'This will permanently remove your restomoney$ account data and empty your shopping profile.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete account'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteAccount().subscribe({
          next: () => {
            Swal.fire({
              title: 'Account Deleted',
              text: 'Your profile has been wiped cleanly.',
              icon: 'success',
              confirmButtonColor: '#fd7e14'
            }).then(() => {
              localStorage.clear();
              window.location.reload();
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'Failed to complete deactivation.',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }
}
