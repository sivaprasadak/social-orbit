import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PostsPreviewService } from "./posts-preview.service";

@Component({
    selector: 'app-posts-preview-modals',
    template: `
    <div>
    <h2 mat-dialog-title style="color: #4f1486;">{{data.title}}</h2>
    <mat-dialog-content class="mat-typography">
      <ng-container *ngComponentOutlet="data.component"></ng-container>
      <mat-dialog-actions [align]="'end'">
          <button mat-button (click)="onClose()" style="color: #4f1486; background-color: #e1d0f1;">Close</button>
          <button mat-button (click)="onPost()" cdkFocusInitial style="background-color: #8759b2; color: white;">Post</button>
      </mat-dialog-actions>
    </mat-dialog-content>
    </div>`,
})
export class PostsPreviewtModalComponent implements OnInit, OnDestroy {
    selectedPostingOption = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string, component: any },
        private readonly postsPreviewService: PostsPreviewService,
        private dialogRef: MatDialogRef<PostsPreviewtModalComponent>,
    ) { }

    ngOnInit(): void {
        this.postsPreviewService.getSelectedPostingOption().subscribe(value => {
            this.selectedPostingOption = value;
        });
    }

    ngOnDestroy(): void {
        this.postsPreviewService.setPostingOption('private');
    }

    onClose() {
        this.dialogRef.close(null);
    }

    onPost() {
        this.dialogRef.close(this.selectedPostingOption);
    }
}