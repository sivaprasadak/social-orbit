import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnDestroy, OnInit {
  form!: FormGroup;
  private readonly destroy$ = new Subject();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get password() {
    return this.form.get('password');
  }

  get email() {
    return this.form.get('email');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.authService.createUser(this.firstName?.value, this.lastName?.value, this.email?.value, this.password?.value)
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl("/login")
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  routeBackToLogin() {
    this.router.navigateByUrl('/login');
  }
}


