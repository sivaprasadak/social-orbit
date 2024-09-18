import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HomeSideBarsComponent } from './home-side-bars.component';
import { InvitationNotificationModule } from '../invitation-notifications/invitation-notifications.module';
import { FriendsModule } from '../friends/friends.module';
import { PeopleYouMayKnowModule } from '../people-you-may-know/people-you-may-know.module';
import { ScrollableContentModalsModule } from '../connected-components/scrollable-content-modals/scrollable-content-modals.module';
import { PostsPreviewModule } from '../posts-preview/posts-preview.module';
import { ProfileModule } from '../auth/profile/profile.module';
import { UserListModule } from '../user-list/user-list.module';

@NgModule({
    declarations: [
        HomeSideBarsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        InvitationNotificationModule,
        FriendsModule,
        PeopleYouMayKnowModule,
        ScrollableContentModalsModule,
        PostsPreviewModule,
        ProfileModule,
        UserListModule,
    ],
    exports: [HomeSideBarsComponent],
})
export class HomeSideBarsModule { }
