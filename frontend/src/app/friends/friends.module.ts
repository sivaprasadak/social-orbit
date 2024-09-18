import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { FriendsComponent } from './friends.component';

@NgModule({
    declarations: [
        FriendsComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
    ],
    exports: [FriendsComponent]
})
export class FriendsModule { }
