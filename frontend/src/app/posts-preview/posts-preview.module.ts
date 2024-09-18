import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PostsPreviewComponent } from './posts-preview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostsPreviewtModalComponent } from './posts-preview-modal.component';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
    declarations: [
        PostsPreviewComponent,
        PostsPreviewtModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatRadioModule
    ],
    exports: [PostsPreviewComponent, PostsPreviewtModalComponent]
})
export class PostsPreviewModule { }
