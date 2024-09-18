import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Subject, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string | null = '';
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;
    private currentUser: any;
    private isCurrentUserAdmin = new BehaviorSubject(false);

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) { }

    getToken() {
        return this.token;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getIsCurrentUserAdmin() {
        return this.isCurrentUserAdmin.asObservable();
    }

    getLoggedInUser() {
        return this.http.get('/api/user').pipe(tap((res) => {
            this.currentUser = res;
            this.isCurrentUserAdmin.next(this.currentUser.role === 'admin')
        }))
    }

    getAllUsers() {
        return this.http.get(`/api/user/all-users`)
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(firstName: string, lastName: string, email: string, password: string) {
        const payload = {
            fname: firstName,
            lname: lastName,
            email,
            password
        }
        return this.http.post('/api/user/signup', payload);
    }

    login(email: string, password: string) {
        const payload = {
            email,
            password
        }
        return this.http.post('/api/user/login', payload).pipe(map((res: any) => {
            const token = res.token;
            const expirationDuration = res.expiresIn;
            this.setAuthTimer(expirationDuration);
            this.token = token;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expirationDuration * 1000);
            this.saveAuthData(token, expirationDate);
            return res;
        }));
    }

    validateEmail(email: string) {
        return this.http.get('/api/user/validate-email', { params: { email } });
    }

    getProfile() {
        return this.http.get('/api/user/profile');
    }

    updateProfile(firstName: string, lastName: string, email: string,) {
        const payload = {
            fname: firstName,
            lname: lastName,
            email
        }
        return this.http.put('/api/user/profile-update', payload);
    }

    resetPassword(email: string, password: string) {
        const payload = {
            email,
            password
        }
        return this.http.put('/api/user/reset-password', payload);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = (authInformation?.expirationDate as Date).getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation?.token as string;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    deleteAccount(userId: string) {
        return this.http.delete(`/api/user/account/${userId}`);
    }

    logout() {
        this.token = null;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigateByUrl('/login');
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString())
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token && !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate as string)
        }
    }
}