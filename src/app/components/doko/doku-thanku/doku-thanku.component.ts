import { Component, OnInit } from '@angular/core';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
@Component({
  selector: 'app-doku-thanku',
  templateUrl: './doku-thanku.component.html',
  styleUrls: ['./doku-thanku.component.css']
})
export class DokuThankuComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  constructor(private interactionService: InteractionService) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
  }

}
