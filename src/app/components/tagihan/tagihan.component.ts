import { Component, OnInit } from '@angular/core';
import { Logger } from '../../_helpers/Logger';
import { common } from '../../_helpers/Request.interface';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../_helpers/Session.service';
import { InteractionService } from '../../_services/Interaction.service';
import { Router } from '@angular/router';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { Properties } from '../../_helpers/properties';


@Component({
  selector: 'app-tagihan',
  templateUrl: './tagihan.component.html',
  styleUrls: ['./tagihan.component.css']
})
export class TagihanComponent implements OnInit {
  public invoiceData;
  public msisdn;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public usertype;

  constructor(
    private http: HttpClient,
    private console: Logger,
    private sessionService: SessionService,
    private interactionService: InteractionService,
    private router: Router,
    private properties: Properties,
    
  ) {
    this.msisdn = this.sessionService.getToken('msisdn');
   }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.usertype = this.sessionService.getToken('subscriberType');
    this.getInvoice();
  }
  // getInvoice(): void {
  //   const data: common = {
  //     callPlan: this.sessionService.getToken('callPlan'),
  //     deviceManufacture: '',
  //     deviceModel: '',
  //     deviceOs: '',
  //     imei: AppConstant.imei,
  //     language: this.sessionService.getToken('language'),
  //     msisdn: this.sessionService.getToken('msisdn'),
  //     secretKey: this.sessionService.getToken('secretKey')
  //   }
  //   this.http.post(APIConstants.INVOICE, data)
  //   .subscribe(r => {
  //     this.console.log('[Tagihan:Init:Success', r);
  //     this.invoiceData = r;
  //   }, e => {
  //     this.console.log('[Tagihan:Init:Error', e);
  //     // Handle Err
  //   });
  // }

  getInvoice(): void {
    const data: common = {
      callPlan: this.sessionService.getToken('callPlan'),
      deviceManufacture: '',
      deviceModel: '',
      deviceOs: '',
      imei: this.properties.getOSName(), 
      language: this.sessionService.getToken('language'),
      msisdn: this.sessionService.getToken('msisdn'),
      secretKey: this.sessionService.getToken('secretKey')
    }
    let ApiConstant;
    if (this.sessionService.getToken('subscriberType') === 'Hybrid') {

      ApiConstant = APIConstants.HYBRIDINVOICE;

    } else {
      ApiConstant = APIConstants.INVOICE;
    }

    
    this.http.post(ApiConstant, data)
    .subscribe(r => {
      
      this.invoiceData = r;
    }, e => {
      
      // Handle Err
    });
  }


  tagihanSummmary(id: number): void {
    if (this.usertype === 'Hybrid') {
      for (let i = 0; i < this.invoiceData.billingList.length;  i++) {
        if (this.invoiceData.billingList[i].invoiceId === id) {
          this.interactionService.setInvoiceData(this.invoiceData.billingList[i]);
        }
      }
      this.sessionService.removeToken('hybridpkgname');
      this.sessionService.setToken('hybridpkgname',this.invoiceData.billingName);
    } else {
      for (let i = 0; i < this.invoiceData.rptInvoiceSummarys.length;  i++) {
        if (this.invoiceData.rptInvoiceSummarys[i].id === id) {
          this.interactionService.setInvoiceData(this.invoiceData.rptInvoiceSummarys[i]);
        }
      }
    }
    this.router.navigate(['/tagihan-summary']);
  }

}
