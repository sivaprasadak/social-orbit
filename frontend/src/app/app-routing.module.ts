import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'reset-password', loadChildren: () => import('./auth/reset-password-page/reset-password-page.module').then(m => m.ResetPasswordPageModule) },
  { path: 'registration', loadChildren: () => import('./auth/registration-page/registration-page.module').then(m => m.RegistrationPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: "**", redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }