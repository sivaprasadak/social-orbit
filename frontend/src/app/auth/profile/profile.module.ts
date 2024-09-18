import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../auth.guard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileModalComponent } from './profile-modal.component';

const routes: Routes = [
    { path: '', component: ProfileComponent, canActivate: [AuthGuard] }
]

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileModalComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule
    ],
    providers: [AuthGuard]
})
export class ProfileModule { }
