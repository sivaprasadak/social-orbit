import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
    private readonly posts = new BehaviorSubject([]);

    constructor(
        private readonly http: HttpClient,
    ) { }

    getPosts() {
        this.http.get("/api/posts").subscribe((res: any) => {
            this.posts.next(res.posts);
        })
    }

    submitPost(file: File, type: string) {
        const postData = new FormData();
        postData.append('image', file as File);
        postData.append('type', type);
        this.http.post("/api/posts", postData).subscribe(() => {
            this.getPosts()
        });
    }
}