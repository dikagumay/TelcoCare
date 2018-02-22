import { ModalData, ModalService } from '../modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal-success',
    templateUrl: 'modal.success.html'
})
export class ModalSuccessComponent {
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
