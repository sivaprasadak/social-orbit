import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css'],
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  showPasswordFields = false;
  showSubmitButton = false
  private readonly destroy$ = new Subject();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private authService: AuthService
  ) { }

  get confirmPassword() {
    return this.form.get('confirm_password');
  }

  get password() {
    return this.form.get('password');
  }

  get email() {
    return this.form.get('email');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });

    this.confirm_password_state_handler();

    this.password?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.confirm_password_state_handler();
    });

    this.confirmPassword?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (!this.confirmPassword?.pristine && this.password?.value && value !== this.password?.value) {
        this.confirmPassword?.setErrors({ 'password_mismatch': true });
      }
    });
  }

  confirm_password_state_handler() {
    if (this.password?.value.length === 0) {
      this.confirmPassword?.disable();
    } else {
      this.confirmPassword?.enable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  validateEmail() {
    this.authService.validateEmail(this.email?.value).subscribe({
      next: () => {
        this.showPasswordFields = true;
        this.showSubmitButton = true
        this.email?.disable();
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  onSubmit() {
    this.authService.resetPassword(this.email?.value, this.password?.value).subscribe({
      next: () => {
        this.router.navigateByUrl("/login")
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  routeBackToLogin() {
    this.router.navigateByUrl('/login');
  }
}
