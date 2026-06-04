import { Component, inject, OnInit, signal, effect } from '@angular/core';
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

  editProfileForm = this.fb.group({
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    picture: this.fb.control(''),
    phoneNumber: this.fb.control(''),
    address: this.fb.control(''),
    age: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(120)])
  });

  passwordForm = this.fb.group({
    currentPassword: this.fb.control('', [Validators.required]),
    newPassword: this.fb.control('', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/[!@#$%^&*(),.?":{}|<>]/)
    ]),
    confirmPassword: this.fb.control('', [Validators.required])
  });

  constructor() {
    effect(() => {
      const data = this.userData();
      if (data) {
        this.editProfileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          picture: data.picture || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          age: data.age ? Number(data.age) : 18
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        const userEmail = res.data?.email || localStorage.getItem('current_user_email') || 'anonymous';
        
        const localPicture = localStorage.getItem(`${userEmail}_pic`);
        const localPhone = localStorage.getItem(`${userEmail}_phone`);
        const localAddress = localStorage.getItem(`${userEmail}_address`);
        const localAge = localStorage.getItem(`${userEmail}_age`);
        
        const completeUserData = {
          ...res.data,
          picture: localPicture || res.data?.picture || '',
          phoneNumber: localPhone || res.data?.phoneNumber || '',
          address: localAddress || res.data?.address || '',
          age: localAge !== null ? Number(localAge) : (res.data?.age || 18)
        };
        this.userData.set(completeUserData);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  submitProfileEdit(): void {
    if (this.editProfileForm.invalid) {
      return;
    }

    const pictureUrlString = this.editProfileForm.controls.picture.value || '';
    const phoneString = this.editProfileForm.controls.phoneNumber.value || '';
    const addressString = this.editProfileForm.controls.address.value || '';
    const ageValue = this.editProfileForm.controls.age.value ? Number(this.editProfileForm.controls.age.value) : 18;
    const userEmail = this.userData()?.email || localStorage.getItem('current_user_email') || 'anonymous';

    if (pictureUrlString) localStorage.setItem(`${userEmail}_pic`, pictureUrlString);
    else localStorage.removeItem(`${userEmail}_pic`);

    if (phoneString) localStorage.setItem(`${userEmail}_phone`, phoneString);
    else localStorage.removeItem(`${userEmail}_phone`);

    if (addressString) localStorage.setItem(`${userEmail}_address`, addressString);
    else localStorage.removeItem(`${userEmail}_address`);

    localStorage.setItem(`${userEmail}_age`, ageValue.toString());

    this.userService.editProfile({
      firstName: this.editProfileForm.controls.firstName.value!,
      lastName: this.editProfileForm.controls.lastName.value!,
      picture: pictureUrlString,
      phoneNumber: phoneString,
      address: addressString,
      age: ageValue
    }).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Your profile details have been updated.',
          icon: 'success',
          confirmButtonColor: '#fd7e14'
        });
        this.fetchProfile();
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Update Failed',
          text: err.error?.detail || err.error?.message || 'Failed to modify profile details.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
        this.fetchProfile();
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
      oldPassword: this.passwordForm.controls.currentPassword.value!,
      newPassword: this.passwordForm.controls.newPassword.value!,
      confirmPassword: this.passwordForm.controls.confirmPassword.value!
    }).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Your password has been changed successfully.',
          icon: 'success',
          confirmButtonColor: '#fd7e14'
        });
        this.passwordForm.reset();
      },
      error: (err: any) => {
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
          error: (err: any) => {
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
