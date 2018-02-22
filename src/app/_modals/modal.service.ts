import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ModalService {
    private subject = new Subject<any>();

    emit(message: any) {
        this.subject.next(message);
    }

    getInstance(): Observable<any> {
        return this.subject.asObservable();
    }
}

export interface ModalData {
    title: string;
    msg: string;
}

export const ErrModalData: ModalData = {
    title: 'Error',
    msg: 'Error Occured'
};

export const SuccModalData: ModalData = {
    title: 'Success',
    msg: 'Success'
};

export const PromptModalData: ModalData = {
    title: 'Prompt',
    msg: 'Are you sure yes / No ?'
};
