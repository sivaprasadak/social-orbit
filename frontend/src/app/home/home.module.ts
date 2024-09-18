import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../auth/auth.guard';
import { ConfirmModalModule } from '../connected-components/confirm-modals/confirm-modal.module';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeSideBarsModule } from '../home-side-bars/home-side-bars.module';
import { NewsFeedModule } from '../news-feed/news-feed.module';

const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
            { path: 'posts', loadChildren: () => import('../posts/posts.module').then(m => m.PostsModule) }
        ]
    },

]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ConfirmModalModule,
        CommonModule,
        MatProgressSpinnerModule,
        HomeSideBarsModule,
        NewsFeedModule
    ],
    declarations: [HomeComponent],
    providers: [AuthGuard],
})
export class HomeModule { }
