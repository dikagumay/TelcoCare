import { SessionStorage } from './Session.storage';
import { _contains } from './Utils';
import { Logger } from './Logger';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './Auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    urlExcept = [
        '/login',
    ];

    constructor(
        private router: Router,
        private Auth: AuthService,
        private console: Logger,
        private sessionDb: SessionStorage
    ) { }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const urlNav = state.url;
        return this.callAuthservice(urlNav);
    }

    public callAuthservice(url: string): boolean {
        

        const check = _contains(url, this.urlExcept);
        

        if (this.Auth.getAuth()) {
            if (check) {
                this.router.navigate(['/']);
                return false;
            }
            return true;
        } else {
            if (check) {
                return true;
            }
            this.router.navigate(['/login']);
            this.sessionDb.clearSession();
            return false;
        }
    }


}
