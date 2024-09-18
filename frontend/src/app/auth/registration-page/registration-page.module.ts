import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPageComponent } from './registration-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: RegistrationPageComponent }
]


@NgModule({
    declarations: [
        RegistrationPageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
})
export class RegistrationPageModule { }
