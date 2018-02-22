import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../_services/Interaction.service';
import { Router } from '@angular/router';
import { Properties } from "app/_helpers/properties";
import { SessionService } from "app/_helpers/Session.service";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';

@Component({
  selector: 'app-pascabayar',
  templateUrl: './pascabayar.component.html',
  styleUrls: ['./pascabayar.component.css']
})
export class PascabayarComponent implements OnInit {
  public invoiceData;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;

  constructor(
    private interactionService: InteractionService,
    private router: Router,
    private properties:Properties,
    private sessionService:SessionService
  ) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.pascabayarInIt();
  }
  pascabayarInIt(): void {
    this.interactionService.invoiceSubject.subscribe( data => {
      this.invoiceData = data;
      this.sessionService.removeToken('billamnt');
      this.sessionService.setToken('billamnt', this.invoiceData.lastmonthbill);
    })
  }

  payBill(){
    
    this.sessionService.setToken('billingdata', JSON.stringify(this.invoiceData));
    //this.properties.setBillingData(this.invoiceData);
    this.router.navigate(['/billing']);
  }

}
