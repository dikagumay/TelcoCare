import { ModalData, ModalService } from '../modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal-error',
    templateUrl: 'modal.error.html'
})
export class ModalErrorComponent {
    public modalDataObj: ModalData;

    constructor(
        public bsModalRef: BsModalRef,
        private mservice: ModalService
    ) { }

    emitEv(): void {
        this.mservice.emit({
            click: 'ok'
        });
        this.bsModalRef.hide();
    }
}
