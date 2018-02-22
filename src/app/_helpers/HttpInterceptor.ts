import { SessionStorage } from './Session.storage';
import { SessionService } from './Session.service';
import { Router } from '@angular/router';
import { _contains } from './Utils';
import { config } from '../_config/config';
import { Logger } from './Logger';
import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Rx';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class InterceptedHttp implements HttpInterceptor {
    // API Ignore Headers
    IgnoreAPIList: any = [
        'login',
    ];

    // API to be Cached
    CacheAPIList: any = [
    ];

    constructor(
        private console: Logger,
        private router: Router,
        private session: SessionService,
        private sessionDb: SessionStorage
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        this.console.warn('Request ::', req);
        // check Cache
        // if (this.InCache(req)) {
        //     return Observable.of(this.session.getTokenData(req.url));
        // }
        // Add Headers
        // const _headers = this.addHeaders(req);
        // Add BaseUrl
        // const _secure = _headers.clone({ url: config.baseUrl + req.url });
        if ( req.url.indexOf('http://180.214.233.217') !== -1 ) {
            
        }else {
            const _secure = req.clone({ url: config.baseUrl + req.url });
            return next.handle(_secure)
                .do(res => {
                    if (res instanceof HttpResponse) {
                        this.console.warn('Response ::', res);
                    }
                }, err => {
                    this.console.warn('Error Response ::', err);
                    this.HandleErrorResponse(err);
                });

        }
    }

    addHeaders(req: HttpRequest<any>): HttpRequest<any> {
        // Before Login Pages No Headers
        if (_contains(req.url, this.IgnoreAPIList)) {
            return req;
        }
        const _customHeaders = {
            'token': this.session.getToken('AuthKey'),
            'Content-Type': 'application/json',
        };
        const request = req.clone({ setHeaders: _customHeaders });
        return request;
    }

    HandleErrorResponse(err: any): void {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
                // redirect to Login Page & Clear Session Storage
                this.router.navigate(['/login']);
                this.sessionDb.clearSession();
            }
        }
    }

    // check Url in CacheList & check Key in SessionStorage / Local Storage / Getters
    // check cache - true option in Http Call
    InCache(req: HttpRequest<any>): boolean {
        const url = req.url;
        return _contains(url, this.CacheAPIList) && this.session.checkKey(url);
    }
}

export const _HttpMiddleware = {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptedHttp,
    multi: true,
};
