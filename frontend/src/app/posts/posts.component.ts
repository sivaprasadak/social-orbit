import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostsPreviewService } from '../posts-preview/posts-preview.service';
import { PostsService } from './posts.service';
import { PostsPreviewtModalComponent } from '../posts-preview/posts-preview-modal.component';
import { PostsPreviewComponent } from '../posts-preview/posts-preview.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;
  private readonly dialog = inject(MatDialog);
  isAdmin = this.authService.getIsCurrentUserAdmin();
  posts: any = [];

  constructor(
    private readonly authService: AuthService,
    private readonly postsPreviewService: PostsPreviewService,
    private readonly postsService: PostsService
  ) { }

  triggerFileInput() {
    this.filePicker.nativeElement.value = '';
    this.filePicker.nativeElement.click();
  }

  onImagePicked(event: Event) {
    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    this.postsPreviewService.setSelectedImage(file);
    this.dialog.open(PostsPreviewtModalComponent, {
      data: { title: 'Post Preview', component: PostsPreviewComponent },
    }).afterClosed().subscribe((res) => {
      if (res) {
        this.postsService.submitPost(file, res);
      } else {
        this.postsPreviewService.setSelectedImage(null);
      }
    });
  }

}
