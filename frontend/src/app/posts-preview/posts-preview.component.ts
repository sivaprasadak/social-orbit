import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsPreviewService } from './posts-preview.service';
import { filter } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-posts-preview',
  templateUrl: './posts-preview.component.html',
  styleUrls: ['./posts-preview.component.css']
})
export class PostsPreviewComponent implements OnInit, OnDestroy {
  image = new FormControl<File | null>(null, { validators: [Validators.required], asyncValidators: [mimeType] });
  imagePreview: string = '';
  contentLoaded = false;
  selectedPostingOption = this.postsPreviewService.getSelectedPostingOption();

  constructor(
    private readonly postsPreviewService: PostsPreviewService
  ) { }

  ngOnInit(): void {
    this.postsPreviewService.getSelectedImage().pipe(filter(Boolean)).subscribe((file) => {
      this.image.setValue(file);
      this.image.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.contentLoaded = true;
      };
      reader.readAsDataURL(file);
    })
  }

  ngOnDestroy(): void {
    this.image.setValue(null);
    this.imagePreview = '';
  }

  onSelection({ value }: any) {
    this.postsPreviewService.setPostingOption(value);
  }
}
