import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ScrollableContentModalComponent } from '../connected-components/scrollable-content-modals/scrollable-content-modals.component';
import { InvitationNotificationComponent } from '../invitation-notifications/invitation-notifications.component';
import { FriendsComponent } from '../friends/friends.component';
import { PeopleYouMayKnowComponent } from '../people-you-may-know/people-you-may-know.component';
import { confirmModalComponent } from '../connected-components/confirm-modals/confirm-modal.component';
import { PostsPreviewComponent } from '../posts-preview/posts-preview.component';
import { PostsPreviewService } from '../posts-preview/posts-preview.service';
import { ProfileComponent } from '../auth/profile/profile.component';
import { ProfileModalComponent } from '../auth/profile/profile-modal.component';
import { PostsPreviewtModalComponent } from '../posts-preview/posts-preview-modal.component';
import { PostsService } from '../posts/posts.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-home-side-bars',
  templateUrl: './home-side-bars.component.html',
  styleUrls: ['./home-side-bars.component.css']
})
export class HomeSideBarsComponent {
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;
  private readonly dialog = inject(MatDialog);
  isAdmin = this.authService.getIsCurrentUserAdmin();

  constructor(
    private readonly authService: AuthService,
    private readonly postsPreviewService: PostsPreviewService,
    private readonly postsService: PostsService
  ) { }

  onProfile() {
    this.dialog.open<ProfileModalComponent>(ProfileModalComponent, {
      width: '25rem',
      data: { title: 'Profile', component: ProfileComponent },
    });
  }

  invitationNotification() {
    this.dialog.open<ScrollableContentModalComponent>(ScrollableContentModalComponent, {
      data: { title: 'Notifications', component: InvitationNotificationComponent },
    });
  }

  getFriends() {
    this.dialog.open<ScrollableContentModalComponent>(ScrollableContentModalComponent, {
      data: { title: 'Friends', component: FriendsComponent },
    });
  }

  peopleYouMayKnow() {
    this.dialog.open<ScrollableContentModalComponent>(ScrollableContentModalComponent, {
      data: { title: 'People You May Know', component: PeopleYouMayKnowComponent },
    });
  }

  onDeleteAccount(): void {
    this.dialog.open<confirmModalComponent>(confirmModalComponent, {
      data: { title: 'Delete Account', content: 'Are you sure you want to delete account?' },
    }).afterClosed().subscribe((res) => {
      if (res) {
        const currentUser = this.authService.getCurrentUser();
        this.authService.deleteAccount(currentUser._id).subscribe({
          next: () => {
            this.authService.logout();
          },
          error: (err) => {
            console.error('Error deleting account', err);
          }
        })
      }
    })
  }

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

  getUsers() {
    this.dialog.open<ScrollableContentModalComponent>(ScrollableContentModalComponent, {
      data: { title: 'Users', component: UserListComponent },
    });
  }
}
