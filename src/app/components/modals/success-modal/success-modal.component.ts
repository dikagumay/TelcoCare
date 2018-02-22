import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent implements OnInit {
  public msg:String;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  constructor(public bsModalRef: BsModalRef,private interactionService: InteractionService) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    });
    if ( this.languageUse === '0') {
      this.msg = 'Kami telah menermia pesan Anda dan akan segera menindaklanjuti dalam 24 jam';
    } else {
      this.msg = 'We have encountered your message and will follow up in 24 hours immediately';
    }
  }
  closeModal(){
    this.bsModalRef.hide();
  }

}
