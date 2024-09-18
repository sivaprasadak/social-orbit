import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  currentUser = this.authService.getCurrentUser();
  friends: any = [];

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    forkJoin([this.authService.getAllUsers(), this.getFriends()])
      .subscribe(([allUsers, activeFriends]: [any, any]) => {
        this.friends = activeFriends.friends.map((friend: any) => {
          return allUsers.find((user: any) => {
            return user._id === friend.userId;
          })
        })
      })
  }

  getFriends() {
    return this.http.get(`/api/user/get-friends`);
  }
}
