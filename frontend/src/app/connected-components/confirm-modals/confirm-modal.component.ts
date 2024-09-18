import { Component, Inject, inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
})
export class confirmModalComponent {
    readonly dialogRef = inject(MatDialogRef<confirmModalComponent>);

    constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, content: string }) { }
}