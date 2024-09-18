import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsFeedComponent } from './news-feed.component';

@NgModule({
    declarations: [
        NewsFeedComponent,
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [NewsFeedComponent]
})
export class NewsFeedModule { }
