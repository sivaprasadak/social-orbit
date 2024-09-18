import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { InvitationNotificationComponent } from './invitation-notifications.component';

@NgModule({
    declarations: [
        InvitationNotificationComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        FormsModule
    ],
    exports: [InvitationNotificationComponent]
})
export class InvitationNotificationModule { }
