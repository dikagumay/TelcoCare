import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalShow } from '../_modals/modal.show';
import { Observable, Subscription } from 'rxjs/Rx';

const InAcitivtytimer = 0;
const Sessiontimer = 0;

// Page Reload Data not Handled
@Injectable()
export class SessionTimeout {
    private timeout: Subscription;

    constructor(
        private modal: ModalShow,
        private http: HttpClient
    ) { }

    // [InActivity Timeout ] start
    public startTimer(): void {
        this.timeout = Observable.timer(InAcitivtytimer)
            .subscribe(r => {
                this.timerExpired();
            });
        this.sessionTimeout();
    }

    public stopTimer(): void {
        if (this.timeout)
            this.timeout.unsubscribe();
    }

    public resetTimer(): void {
        this.stopTimer();
        this.startTimer();
    }

    public timerExpired(): void {
        this.stopTimer();
        const sub = this.modal.promptModal({
            title: 'Session Expiring!',
            msg: 'Your session is about to expire.  Still there?'
        }).subscribe(r => {
            if (r.click === 'ok') {
                this.resetTimer();
                sub.unsubscribe();
            }
        });
    }
    // [ Session Timeout -> Refresh Token ]
    public sessionTimeout(): void {
        const sub = Observable.timer(Sessiontimer)
            .subscribe(r => {
                // Call Refresh token API & Update Session storage
                this.http.get('')
                    .subscribe(res => {
                        this.resetTimer();
                        sub.unsubscribe();
                    });
            });
    }
}
