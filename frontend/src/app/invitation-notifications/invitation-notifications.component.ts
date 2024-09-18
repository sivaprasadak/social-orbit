import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'app-invitation-notification',
    templateUrl: './invitation-notifications.component.html',
    styleUrls: ['./invitation-notifications.component.css']
})
export class InvitationNotificationComponent implements OnInit {
    invitations: any = [];
    currentUser = this.authService.getCurrentUser();

    constructor(
        private readonly authService: AuthService,
        private readonly http: HttpClient
    ) { }

    ngOnInit(): void {
        forkJoin([this.authService.getAllUsers(), this.getInvitation()])
            .subscribe(([userList, invitationResponse]: [any, any]) => {
                if (invitationResponse.invitations.length) {
                    const invitationList = invitationResponse.invitations[0]['fields'][this.currentUser._id];
                    this.invitations = userList.filter((user: any) => {
                        return Boolean(invitationList?.find((iUser: any) => iUser.fromUserId === user._id))
                    })
                }
            })
    }

    acceptInvitation(user: any) {
        const payload = {
            fromUserId: user._id,
            toUserId: this.currentUser._id
        }
        this.http.put('/api/invitation/accept', payload).subscribe(({
            next: () => {
                this.invitations = this.invitations.filter((iUser: any) => user._id !== iUser._id)
            }
        }));
    }

    getInvitation() {
        return this.http.get('/api/invitation');
    }
}
