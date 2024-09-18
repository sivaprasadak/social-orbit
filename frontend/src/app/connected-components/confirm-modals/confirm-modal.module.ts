import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { confirmModalComponent } from './confirm-modal.component';

@NgModule({
    imports: [
        MatButtonModule,
        MatDialogModule
    ],
    declarations: [confirmModalComponent],
    exports: [confirmModalComponent]
})
export class ConfirmModalModule { }
