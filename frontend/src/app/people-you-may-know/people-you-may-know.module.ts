import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleYouMayKnowComponent } from './people-you-may-know.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        PeopleYouMayKnowComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        FormsModule
    ],
    exports: [PeopleYouMayKnowComponent]
})
export class PeopleYouMayKnowModule { }
