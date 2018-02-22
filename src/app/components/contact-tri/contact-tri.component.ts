import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';

@Component({
  selector: 'app-contact-tri',
  templateUrl: './contact-tri.component.html',
  styleUrls: ['./contact-tri.component.css']
})
export class ContactTriComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  constructor(
    private router: Router,
    private interactionService: InteractionService
  ) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
  }
  chatCare(): void {
    this.router.navigate(['/chat-care']);
  }
  leaveMsg(): void {
    this.router.navigate(['/leave-msg']);
  }

}
