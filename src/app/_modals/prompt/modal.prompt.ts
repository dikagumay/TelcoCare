import { ModalData, ModalService } from '../modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal-prompt',
    templateUrl: 'modal.prompt.html'
})
export class ModalPromptComponent {
    public modalDataObj: ModalData;

    constructor(
        public bsModalRef: BsModalRef,
        private mservice: ModalService
    ) { }

    emitEv(name: string): void {
        this.mservice.emit({
            click: name
        });
        this.bsModalRef.hide();
    }
}
