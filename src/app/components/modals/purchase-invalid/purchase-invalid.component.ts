import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
@Component({
  selector: 'app-purchase-invalid',
  templateUrl: './purchase-invalid.component.html',
  styleUrls: ['./purchase-invalid.component.css']
})
export class PurchaseInvalidComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  constructor(public bsModalRef: BsModalRef, private interactionService: InteractionService) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
  }
  closeModal(){
    this.bsModalRef.hide();
  }
}
