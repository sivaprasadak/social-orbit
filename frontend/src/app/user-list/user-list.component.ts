import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: any = [];
  currentUser = this.authService.getCurrentUser();

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((res) => {
      this.users = res;
    })
  }

  onDeleteAccount(user: any) {
    this.authService.deleteAccount(user._id).subscribe(({
      next: () => {
        this.users = this.users.filter((sUser: any) => user._id !== sUser._id)
      }
    }));
  }
}
