import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'app-people-you-may-know',
    templateUrl: './people-you-may-know.component.html',
    styleUrls: ['./people-you-may-know.component.css']
})
export class PeopleYouMayKnowComponent implements OnInit {
    suggestedUsers: any = [];
    currentUser = this.authService.getCurrentUser();

    constructor(
        private readonly authService: AuthService,
        private readonly http: HttpClient
    ) { }

    ngOnInit(): void {
        forkJoin([this.authService.getAllUsers(), this.getInvitation()])
            .subscribe(([userList, invitationResponse]: [any, any]) => {
                this.suggestedUsers = userList.filter((user: any) => user._id !== this.currentUser._id);
                this.suggestedUsers = this.suggestedUsers.filter((user: any) => !(user.friends.find((a: any) => a.userId === this.currentUser._id)));
                const invitationList = invitationResponse.invitations;
                if (invitationList.length) {
                    // if user 1 has sent invitation to user 2 then user 2 is removed
                    this.suggestedUsers = this.suggestedUsers.filter((sUser: any) => {
                        return !(invitationList[0]['fields'][sUser._id] && invitationList[0]['fields'][sUser._id].find((user: any) => {
                            return user.fromUserId === this.currentUser._id
                        }))
                    });
                    // if user 1 has received invitation from user 2 then user 2 is removed
                    this.suggestedUsers = this.suggestedUsers.filter((sUser: any) => {
                        return !(invitationList[0]['fields'][this.currentUser._id] && invitationList[0]['fields'][this.currentUser._id].find((user: any) => {
                            return user.fromUserId === sUser._id
                        }))
                    });
                }
            })
    }

    sendInvitation(user: any) {
        const payload = {
            fromUserId: this.currentUser._id,
            toUserId: user._id
        }
        this.http.put('/api/invitation/send', payload).subscribe(({
            next: () => {
                this.suggestedUsers = this.suggestedUsers.filter((sUser: any) => user._id !== sUser._id)
            }
        }));
    }

    getInvitation() {
        return this.http.get('/api/invitation');
    }
}
