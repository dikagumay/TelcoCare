import { Component, OnInit } from '@angular/core';
import { Logger } from '../../_helpers/Logger';
import { RemainCredit, GetInfo } from '../../_helpers/Request.interface';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../_helpers/Session.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { Properties } from 'app/_helpers/properties';

@Component({
  selector: 'app-remaining-credit',
  templateUrl: './remaining-credit.component.html',
  styleUrls: ['./remaining-credit.component.css']
})
export class RemainingCreditComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public invoiceData;
  public creditData;
  public msisdn;

  constructor(
    private console: Logger,
    private sessionService: SessionService,
    private http: HttpClient,
    private interactionService: InteractionService,
    private properties: Properties,

  ) {
    this.msisdn = this.sessionService.getToken('msisdn');
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.remainingcreditInIt();
  }

  remainingcreditInIt(): void {
    const dataGetInfo = {
      'msisdn': this.sessionService.getToken('msisdn'),
      'imei': this.properties.getOSName(),
      'secretKey': this.sessionService.getToken('secretKey'),
      'language': this.sessionService.getToken('language'),
      'subscriberType': this.sessionService.getToken('subscriberType'),
      'callPlan': this.sessionService.getToken('callPlan')
    }

    this.http.post(APIConstants.GET_INFO, dataGetInfo)
    .subscribe(r => {
      
      this.invoiceData = r;
      if ( this.invoiceData.status === true) {
          const data: RemainCredit = {
          'accountnumber':  this.invoiceData.accountNumber,
          'callPlan': this.sessionService.getToken('callPlan'),
          'deviceManufacture': '',
          'deviceModel': '',
          'deviceOs': '',
          'imei': this.properties.getOSName(),
          'invoicenumber':  this.invoiceData.amountInvoice,
          'language': this.sessionService.getToken('language'),
          'msisdn': this.sessionService.getToken('msisdn'),
          'secretKey': this.sessionService.getToken('secretKey')
        }
        this.http.post(APIConstants.REMAINING_CREDIT, data).
        subscribe( res => {
          this.creditData = res;
          
        }, err => {
          
        })
      }
    }, e => {
      
      // Handle Err
    });
  }

}
