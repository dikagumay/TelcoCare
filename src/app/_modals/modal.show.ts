import { ErrModalData, ModalData, ModalService, PromptModalData, SuccModalData } from './modal.service';
import { ModalErrorComponent } from './error/modal.error';
import { ModalSuccessComponent } from './success/modal.success';
import { ModalPromptComponent } from './prompt/modal.prompt';
import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Injectable()
export class ModalShow {
    subscription: Subscription;
    modalRef: BsModalRef;

    private config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true,
    };
    private _genericConfig = {
        ...this.config,
        class: 'modal-sm'
    };
    constructor(
        private modal: BsModalService,
        private modalService: ModalService,
    ) { }


    errorModal(data: ModalData = ErrModalData): Observable<any> {
        return this.showModal(ModalErrorComponent, undefined, data);
    }

    promptModal(data: ModalData = PromptModalData): Observable<any> {
        return this.showModal(ModalPromptComponent, undefined, data);
    }

    successModal(data: ModalData = SuccModalData): Observable<any> {
        return this.showModal(ModalSuccessComponent, undefined, data);
    }

    // Generic Modal & Subject Events
    showModal(modalName: any, options: any = this._genericConfig, data: ModalData): Observable<any> {
        this.modalRef = this.modal.show(modalName, options);
        this.modalRef.content.modalDataObj = data;
        return this.modalService
            .getInstance()
            .map(msg => msg);
    }

    // Common Modal
    show(modalName: any, configTrig: boolean = false, data: any = {}) {
        let _config = {};
        if (configTrig) {
            _config = this.config;
        }
        this.modalRef = this.modal.show(modalName, _config);
        this.modalRef.content.data = data;
        return this.modalService
            .getInstance()
            .map(msg => msg);
    }
}
