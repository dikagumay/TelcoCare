import { ModalShow } from '../_modals/modal.show';
import { Observable, Subscription } from 'rxjs/Rx';
import { isEmpty, isUndefined } from './Utils';
import { config } from './../_config/config';
import * as CryptoJS from 'crypto-js';
import { SessionStorage } from './Session.storage';
import { Injectable } from '@angular/core';

const AuthKey = '';

@Injectable()
export class SessionService {
    public menuCategoryName: string;
    
    constructor(
        private sessionDb: SessionStorage
    ) { }

    public setToken(key, value) {
        // Get key and Value , Encrypt Value & Store in LocalStorage / Session Storage
        this.sessionDb.store(key, this.encryptToken(value));
    }


    // check If key With Data Exists in Local Storage / Session Storage
    public checkKey(key: any): boolean {
        const v = this.sessionDb.retrive(key);
        return !isUndefined(v) && !isEmpty(v);
    }

    // get Data from Session Storage
    public getToken(key: any) {
        return this.decryptToken(this.sessionDb.retrive(key));
    }

    // [Encryption ] Start
    public isDecryptValid(token: any): boolean {
        // Here Add Decryption Function & check
        if (this.decryptToken(token)) {
            return true;
        }
        return false;
    }

    public encryptToken(token: any): string {
        if (!this.encryptionToggle()) return token;

        const encryptedToken = CryptoJS.AES.encrypt(token, config.encryptionKey);
        // Encryption Logic Here
        return encryptedToken;
    }

    public decryptToken(token: any): string {
        if (!this.encryptionToggle()) return token;

        const bytes = CryptoJS.AES.decrypt(token.toString(), config.encryptionKey);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
        // Decryption Logic Here
        return decryptedToken;
    }

    public encryptionToggle(): boolean {
        return config.encryption;
    }

    //remove token
    public removeToken(key: string){
        this.sessionDb.remove(key);
    }
}

