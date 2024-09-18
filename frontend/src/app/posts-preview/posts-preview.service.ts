import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsPreviewService {
    private readonly selectedImage = new BehaviorSubject<File | null>(null);
    private readonly selectedPostingOption = new BehaviorSubject<any>('private');

    setSelectedImage(file: File | null) {
        this.selectedImage.next(file);
    }

    getSelectedImage() {
        return this.selectedImage.asObservable();
    }

    getSelectedPostingOption() {
        return this.selectedPostingOption.asObservable();
    }

    setPostingOption(option: any) {
        this.selectedPostingOption.next(option);
    }
}