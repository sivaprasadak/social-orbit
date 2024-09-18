import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { confirmModalComponent } from '../connected-components/confirm-modals/confirm-modal.component';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    contentLoaded = false;
    isAdminUser = this.authService.getIsCurrentUserAdmin();

    constructor(
        private readonly authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.getLoggedInUser().subscribe(() => {
            this.contentLoaded = true;
        })
    }

    onLogOut(): void {
        this.dialog.open<confirmModalComponent>(confirmModalComponent, {
            data: { title: 'Logout', content: 'Are you sure you want to logout?' },
        }).afterClosed().subscribe((res) => {
            if (res) {
                this.authService.logout();
            }
        })
    }
}
