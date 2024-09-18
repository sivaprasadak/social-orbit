import { Component, Inject, inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-scrollable-content-modals',
    templateUrl: './scrollable-content-modals.component.html',
})
export class ScrollableContentModalComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, component: any }) { }
}