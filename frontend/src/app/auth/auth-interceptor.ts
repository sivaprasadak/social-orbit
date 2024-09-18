import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private publicApiDomains = ['https://newsapi.org'];
    private apiUrl = environment.apiUrl;
    constructor(
        private readonly authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isPublicApi = this.publicApiDomains.some(domain => req.url.includes(domain));
        const authToken = this.authService.getToken();
        const url = isPublicApi ? req.url : this.apiUrl + req.url;
        const authRequest = req.clone({
            url,
            headers: req.headers.set('authorization', "Bearer" + " " + authToken)
        })
        return next.handle(authRequest);
    }
}