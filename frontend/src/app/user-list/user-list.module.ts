import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './user-list.component';

@NgModule({
    declarations: [
        UserListComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        FormsModule
    ],
    exports: [UserListComponent]
})
export class UserListModule { }
