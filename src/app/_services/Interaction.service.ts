import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SessionService } from '../_helpers/Session.service';

@Injectable()
export class InteractionService {
    public loginStatusSubject = new BehaviorSubject<boolean>(false);
    public notificationCountSubject = new Subject<boolean>();
    public notificationSubject = new BehaviorSubject<any>('');
    public invoiceSubject = new BehaviorSubject<any>('');
    public languageToUseSubject = new BehaviorSubject<string>('0');
    public pageNumberSubject = new BehaviorSubject<number>(1);
    public searchDataSubject = new BehaviorSubject<string>('');
    public themeSubject = new BehaviorSubject<string>('');
    constructor (
        private sessionService: SessionService
    ) {
        if (this.sessionService.checkKey('language')) {
            if (this.sessionService.getToken('language') === '1') {
                this.languageToUseSubject.next('1');
            } else {
                this.languageToUseSubject.next('0');
            }
        }
        if (this.sessionService.checkKey('loginStatus')) {
            if (this.sessionService.getToken('loginStatus') === 'true') {
                this.loginStatusSubject.next(true);
            } else {
                this.loginStatusSubject.next(false);
            }
        }
    }
    setSearchData (data) {
        this.searchDataSubject.next(data);
    }
    setPageNumber ( data) {
        this.pageNumberSubject.next(data);
    }
    setNotificationCount (data) {
        this.notificationCountSubject.next(data);
    }
    changeLoginStatus (data) {
        this.loginStatusSubject.next(data);
    }
    changeLanguage ( data) {
        this.languageToUseSubject.next(data);
    }
    setNotificationData ( data ) {
        this.notificationSubject.next(data);
    }
    setInvoiceData ( data ) {
        this.invoiceSubject.next(data);
    }
    setThemeData ( data ) {
        this.themeSubject.next(data);
    }
}

