import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollableContentModalComponent } from './scrollable-content-modals.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        MatButtonModule,
        MatDialogModule,
        CommonModule,
        FormsModule
    ],
    declarations: [ScrollableContentModalComponent],
    exports: [ScrollableContentModalComponent]
})
export class ScrollableContentModalsModule { }
