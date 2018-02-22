import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
import { SessionService } from 'app/_helpers/Session.service';

@Component({
  selector: 'app-smsmsg',
  templateUrl: './smsmsg.component.html',
  styleUrls: ['./smsmsg.component.css']
})
export class SmsmsgComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  constructor(public bsModalRef:BsModalRef, private interactionService: InteractionService, private sessionService: SessionService) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
  }

  closepopup(){
    this.sessionService.removeToken('buyamnt');
    this.bsModalRef.hide();
  }

}
