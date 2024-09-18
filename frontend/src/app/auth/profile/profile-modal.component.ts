import { Component, Inject, Injector } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-profile-modals',
    template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content class="mat-typography">
      <ng-container *ngComponentOutlet="data.component; injector: profileComponentInjector"></ng-container>
    </mat-dialog-content>`,
})
export class ProfileModalComponent {
    profileComponentInjector: Injector;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string, component: any },
        private dialogRef: MatDialogRef<ProfileModalComponent>,
        private injector: Injector
    ) {
        this.profileComponentInjector = Injector.create({
            providers: [
                { provide: MatDialogRef, useValue: this.dialogRef }
            ],
            parent: this.injector
        });
    }
}