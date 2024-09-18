import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileModalComponent } from './profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  contentLoaded = false;
  private readonly destroy$ = new Subject();

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }


  constructor(
    private dialogRef: MatDialogRef<ProfileModalComponent>,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        this.form = new FormGroup({
          firstName: new FormControl(data.fname, Validators.required),
          lastName: new FormControl(data.lname, Validators.required),
          email: new FormControl({ value: data.email, disabled: true }),
        });
        this.contentLoaded = true;
      },
      error: (err) => {
        console.error('Error fetching profile', err)
      }
    });
  }


  onSubmit() {
    const payload: any = {};
    const controls = this.form.controls;
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        payload[key] = controls[key].value
      }
    }
    this.authService.updateProfile(payload.firstName, payload.lastName, payload.email).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: () => {
        console.log('Error updating profile');
      }
    })
  }

  close() {
    this.dialogRef.close();
  }
}
