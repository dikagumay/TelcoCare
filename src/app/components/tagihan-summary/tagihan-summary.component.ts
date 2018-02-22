import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../_services/Interaction.service';
import { Logger } from '../../_helpers/Logger';
import { SessionService } from '../../_helpers/Session.service';
import { EmailInvoice } from '../../_helpers/Request.interface';
import { HttpClient } from '@angular/common/http';
import { APIConstants, AppConstant } from '../../_config/restapis';

import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from '../../_strings/lang-id';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { TranslateService } from '../../_strings/translate/translate.service';
import { Router } from '@angular/router';
import { Properties } from '../../_helpers/properties';


@Component({
  selector: 'app-tagihan-summary',
  templateUrl: './tagihan-summary.component.html',
  styleUrls: ['./tagihan-summary.component.css']
})
export class TagihanSummaryComponent implements OnInit {
  public invoiceData;
  public invoiceUtcDate;
  public invoiceDate;
  public dd;
  public mm;
  public yyyy;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public usertype;

  constructor(
    private console: Logger,
    private interactionService: InteractionService,
    private sessionService: SessionService,
    private http: HttpClient,
    private router: Router,
    private properties: Properties,
    
  ) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    });
    this.usertype = this.sessionService.getToken('subscriberType');
    this.tagihanSummaryOnIt();
  }
  tagihanSummaryOnIt (): void {
    this.interactionService.invoiceSubject.subscribe( data => {
      
      this.invoiceData = data;
    })
  }
  emailInvoice(): void {
    this.invoiceUtcDate = '/Date(' + this.invoiceData.invoicedate + ')/';



    this.invoiceDate =  new Date( parseFloat( this.invoiceUtcDate.substr(6 ))); // The 0 there is the key, which sets the date to the epoch
    this.dd = this.invoiceDate.getDate();
    this.mm = this.invoiceDate.getMonth();
    this.yyyy = this.invoiceDate.getFullYear();
    if (this.dd < 10) {
      this.dd = '0' + this.dd;
    }
    if (this.mm < 10) {
      this.mm = '0' + this.mm;
    }
    this.invoiceDate = this.dd + '-' + this.mm + '-' + this.yyyy;
    const data: EmailInvoice = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'email': this.sessionService.getToken('email'),
      'imei': this.properties.getOSName(), 
      'invoiceDate': this.invoiceData.invoicedate,
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'secretKey': this.sessionService.getToken('secretKey')
    }
    this.http.post(APIConstants.EMAIL_INVOICE, data).
    subscribe( r => {
      
      alert('Email Send');
    }, e => {
      
      alert('Something went wrong');
    });
  }
  paybill(){
    if(this.usertype.toLowerCase() == 'hybrid'){
      this.router.navigate(['/billing']);
      //need to pass value to billing 
      this.sessionService.removeToken('billamnt');
      this.sessionService.setToken('billamnt', this.invoiceData.currentDue);

    }else{
      this.router.navigate(['/3pascabayar']);
    }
  }

}
