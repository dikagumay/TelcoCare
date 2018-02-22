import { SessionService } from './Session.service';
import { isEmpty, isUndefined } from './Utils';
import { SessionStorage } from './Session.storage';
import { Injectable } from '@angular/core';
import { config } from 'app/_config/config';

const AuthKey = 'AuthKey';

@Injectable()
export class AuthService {

    constructor(
        private sessionDb: SessionStorage,
        private _session: SessionService
    ) { }

    public getAuth(): boolean {
        const v = this.sessionDb.retrive(AuthKey);
        if (!isUndefined(v) && !isEmpty(v)) {
            /*  if (this._session.encryptionToggle())
                 if (this._session.decryptToken(v))
                     return true;
                 else
                     return false; */
            return true;
        }
        return false;
    }

    public setAuthToken(value: string): void {
        this._session.setToken(AuthKey, value);
    }

}
