import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../_helpers/Session.service';
import { BsModalRef } from "ngx-bootstrap";
import { HttpClient } from "@angular/common/http";
import {ModalShow} from '../../../_modals/modal.show';
import { PaymentSuccessComponent } from 'app/components/modals/payment-success/payment-success.component';
import { Properties } from "app/_helpers/properties";
import { SmsmsgComponent } from "app/components/modals/smsmsg/smsmsg.component";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public modalList: any;
  public queryparams: any;
  public base_url: any;
  public url: any;
  public selectedPrice: any;
  public selectedMode: any;
  public amount: any;
  public selectedMethod: any;
  public subscriberType: any;
  public paymentList: any;
  public paymentResp;
  public buyamnt:any;
  constructor(private sessionService: SessionService, public bsModalRef: BsModalRef,
    public modal: ModalShow, private http: HttpClient, private properties:Properties,
    private interactionService: InteractionService) {
      
      this.modalList = this.properties.getItem();
      this.buyamnt = this.sessionService.getToken('buyamnt');
  
   }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
    
  }

  

  purchasePlan() {
    this.closepopup();
    if(this.modalList.paymentList.length === 0){
      this.modal.showModal(PaymentSuccessComponent, false, null);
    }else if ( this.modalList.paymentList[0].methodName.toLowerCase() === 'sms') {
      this.modal.showModal(SmsmsgComponent, false, null);
    }else{
      
      
          this.base_url = 'http://bimaplus.tri.co.id/api/v1/payment-gateway/';
      
          this.amount = Number(this.sessionService.getToken('buyamnt')).toFixed(2);
          this.subscriberType = this.sessionService.getToken('subscriberType');
          if (this.subscriberType.toLowerCase() == "postpaid") {
            this.Postpaiddata("postpaid");
          } else if (this.subscriberType.toLowerCase() == "prepaid") {
            this.Postpaiddata("product");
      
          } else {
            this.Postpaiddata("hybrid");
      
          }
      
          
          window.open(this.url, "_self");
    }
    //if 1 go to confirmation page else call buy API
    //buy call
   
  }

  Postpaiddata(type: string) {
    switch (type) {
      case "postpaid":
        this.queryparams = {
          "AMOUNT": this.amount,
          "AMOUNTPAID": this.amount,
          "PAYMENTMETHODCODE": '01',
          "NAME": "You",
          "EMAIL": "you@h3i.com",
          "MSISDN": this.sessionService.getToken('msisdn'),
          "SECRET_KEY": this.sessionService.getToken('secretKey'),
          "SUBSCRIBERTYPE": this.subscriberType,
          "ACCOUNTNUMBER": 6
        };

        this.url = this.base_url + type.toLowerCase() + '?' + "&AMOUNT=" + this.queryparams.AMOUNT
          + '&AMOUNTPAID=' + this.queryparams.AMOUNTPAID + "&PAYMENTMETHODCODE=" + this.queryparams.PAYMENTMETHODCODE
          + "&NAME=" + this.queryparams.NAME + "&EMAIL=" + this.queryparams.EMAIL + "&MSISDN=" + this.queryparams.MSISDN
          + "&SECRET_KEY=" + this.queryparams.SECRET_KEY + "&SUBSCRIBERTYPE=" + this.queryparams.SUBSCRIBERTYPE
          + "&ACCOUNTNUMBER=" + this.queryparams.ACCOUNTNUMBER;

        break;
      case "hybrid":
        

        this.queryparams = {
          "AMOUNT": this.amount,
          "AMOUNTPAID": this.amount,
          "PAYMENTMETHODCODE": '01',
          "NAME": "You",
          "EMAIL": "you@h3i.com",
          "MSISDN": this.sessionService.getToken('msisdn'),
          "SECRET_KEY": this.sessionService.getToken('secretKey'),
          "SUBSCRIBERTYPE": this.subscriberType,
          "ACCOUNTNUMBER": 6
        };

        this.url = this.base_url + type.toLowerCase() + '?' + "&AMOUNT=" + this.queryparams.AMOUNT
          + '&AMOUNTPAID=' + this.queryparams.AMOUNTPAID + "&PAYMENTMETHODCODE=" + this.queryparams.PAYMENTMETHODCODE
          + "&NAME=" + this.queryparams.NAME + "&EMAIL=" + this.queryparams.EMAIL + "&MSISDN=" + this.queryparams.MSISDN
          + "&SECRET_KEY=" + this.queryparams.SECRET_KEY + "&SUBSCRIBERTYPE=" + this.queryparams.SUBSCRIBERTYPE
          + "&ACCOUNTNUMBER=" + this.queryparams.ACCOUNTNUMBER;
        break;
      case "product":
        

        this.queryparams = {
          "PRODUCTNAME": this.modalList.productName,
          "AMOUNT": this.amount,
          "NAME": "You",
          "PAYMENTMETHODCODE": '01',
          "EMAIL": "you@h3i.com",
          "MSISDN": this.sessionService.getToken('msisdn'),
          "PRODUCTID": this.modalList.productId,
          //"PRODUCTID" : 37709,
          "SERVICEPLAN": "Default",
          "SUBCATEGORY": 'SUBCATEGORYTXT',
          "CATEGORY": 'CATEGORYTXT',
          "SECRET_KEY": this.sessionService.getToken('secretKey'),
          "SUBSCRIBERTYPE": this.subscriberType,
          "DEVICE": 'Device',
          "VENDORID": this.modalList.vendorList[0].vendorId
        };

        this.url = this.base_url + 'product?' + 'PRODUCTNAME=' + this.queryparams.PRODUCTNAME
          + "&AMOUNT=" + this.queryparams.AMOUNT
          + "&NAME=" + this.queryparams.NAME
          + "&EMAIL=" + this.queryparams.EMAIL
          + "&MSISDN=" + this.queryparams.MSISDN
          + "&PRODUCTID=" + this.queryparams.PRODUCTID
          + "&SERVICEPLAN=" + this.queryparams.SERVICEPLAN
          + "&VENDORID=" + this.queryparams.VENDORID
          + "&PAYMENTMETHODCODE=" + this.queryparams.PAYMENTMETHODCODE
          + "&SUBCATEGORY=" + this.queryparams.SUBCATEGORY
          + "&CATEGORY=" + this.queryparams.CATEGORY
          + "&DEVICE=" + this.queryparams.DEVICE;
        
        break;
      default:
        
    }

  }

  closepopup(){
    this.bsModalRef.hide();
  }

}
