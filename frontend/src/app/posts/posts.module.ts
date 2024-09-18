import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { PostsComponent } from './posts.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
    { path: '', component: PostsComponent, canActivate: [AuthGuard] }
]

@NgModule({
    declarations: [
        PostsComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        HttpClientModule,

    ],
    providers: [AuthGuard]
})
export class PostsModule { }
