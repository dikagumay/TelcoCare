import { Component, OnInit } from '@angular/core';
import { Properties } from "app/_helpers/properties";
import { SessionService } from "app/_helpers/Session.service";
import { APIConstants } from "app/_config/restapis";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-billpay',
  templateUrl: './billpay.component.html',
  styleUrls: ['./billpay.component.css']
})
export class BillpayComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public packageObj: any;
  public methodname: string;
  public base_url: string;
  public url: string;
  public subscriberType: string;
  public queryparams: any;
  public amount: any;
  public email: any;
  public name:string;
  public acntno: any;
  public prodid:any;
  public packagename: any;
  constructor(private properties: Properties, private sessionService: SessionService, private interactionService: InteractionService) {
    this.packageObj = JSON.parse(this.sessionService.getToken('packageObj'));
    
    this.methodname = this.packageObj['paymentObj'].methodName;
    if(this.sessionService.getToken('subscriberType').toLowerCase() == 'hybrid'){
      this.packagename = this.sessionService.getToken('hybridpkgname');
    }else{
      this.packagename = this.packageObj.packagename;
    }
      
    
    switch (this.packageObj['paymentObj'].methodCode) {
      case '01':
        this.url = '/doku/dokubuy-cc';
        break;
      case '02':
        this.url = '/doku/dokubuy-mandiri/';
        break;
      case '03':
        this.url = '/sprint/buy/';
        break;
      case '04':
        this.url = '/e2pay/buy/';
        break;
      case '09':
        this.url = '/doku/dokubuy-bri/';
    }
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
  }

  
  buyPackage() {
    let selectedMethod = this.packageObj['paymentObj'].methodCode;
    //this.amount = Number(this.packageObj.price.replace(/\,/g, ""));
    this.amount = Number(this.packageObj.price);
    this.email = this.sessionService.getToken('email');
    if(this.email){
      this.email = 'you@h3i.com';
    }
    let substype = this.sessionService.getToken('subscriberType').toLowerCase();
    if(substype == 'hybrid'){
      this.name = 'you';
      this.acntno = '-'; //from last 6 invoice
      this.prodid = null;         
    }else{
      this.name = JSON.parse(this.sessionService.getToken('billingdata'))['accountname'];
      this.acntno = JSON.parse(this.sessionService.getToken('packageObj'))['accountNumber'];
      this.prodid = JSON.parse(this.sessionService.getToken('billingdata'))['id'];
    }
    //this.url = APIConstants.Billing_URL + this.url
      this.url = environment.billingurl+ this.url
      + "?PRODUCTNAME=" + this.packageObj.packagename
      + '&AMOUNT=' + this.amount
      + '&MSISDN=' + this.sessionService.getToken('msisdn')
      + '&NAME=' + this.name
      + "&PAYMENTMETHOD=" + selectedMethod
      + "&PRODUCTID=" + this.prodid
      + "&VENDORID=0"
      + "&SERVICEPLAN=" + this.sessionService.getToken('callPlan')
      + "&" + this.sessionService.getToken('subscriberType').toUpperCase() +"=1"
      + "&CATEGORY=PROFILE"
      + "&SUBCATEGORY=" + this.sessionService.getToken('subscriberType')
      + "&BILLAMOUNT=" + this.amount
      + "&ACCOUNTNUMBER=" + this.acntno//ok
      + "&EMAIL=" + this.email;
    
    window.open(this.url, "_self");
  }


}
