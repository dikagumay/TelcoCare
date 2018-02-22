import { Component, OnInit } from '@angular/core';
import { Properties } from "app/_helpers/properties";
import { SessionService } from "app/_helpers/Session.service";
import { Http } from '@angular/http';
import { APIConstants } from '../../_config/restapis';
import { Router } from '@angular/router';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from '../../_strings/lang-id';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { TranslateService } from '../../_strings/translate/translate.service';
import { InteractionService } from '../../_services/Interaction.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public invoicdata: any;
  public number: string;
  public selectedMethod: string;
  public packageObj: object;
  public billingData: any;
  public payments: any;
  public channels: string;
  public minidr: number;
  public maxidr:number;
  public selectedChannel: any;
  public billamnt:any;
  public nominal:any;
  public subscribertype:any;
  public msisdn:any;

  constructor(
    private properties:Properties, 
    private sessionService:SessionService, 
    private http:Http,
    private router:Router,
    private interactionService: InteractionService 
  ) { 
    
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.msisdn = this.sessionService.getToken('msisdn');
    this.subscribertype = this.sessionService.getToken('subscriberType').toLocaleLowerCase();
    if(this.subscribertype !== 'hybrid')
    this.invoicdata = JSON.parse(this.sessionService.getToken('billingdata'));
    //this.invoicdata = this.properties.getBillingData();
    this.minidr = 15000;
    this.billamnt = this.sessionService.getToken('billamnt').replace(',','');
    this.getPaymentMethod();
    this.nominal = this.billamnt;
    if(this.subscribertype == 'hybrid'){
      this.billamnt = this.sessionService.getToken('billamnt').substring(4);
      if(this.billamnt == 0){ // if billamnt zero then maxidr will be 15000
        this.maxidr = 15000;
        this.nominal = this.maxidr;
      }else{
        this.maxidr = this.billamnt;
        this.nominal = this.billamnt;
      }
    }else{
      this.getPostpaidInfo();
      this.maxidr = this.billamnt;
    }
    
   

   // this.getPostpaidPaiddetails()
  }

  
  getPaymentMethod(){

    
    

    this.http.get(`/api/profile/postpaid/payment-method`)
    .subscribe(r => {
    
      this.payments = r;
      if(this.payments._body){
        this.channels = JSON.parse(this.payments._body);
        this.selectedChannel = this.channels[0];
      }
      
      
    }, e => {
      // Handle Error

      

    });
  }

  getPostpaidInfo(){

    

    const data ={
        "accountNumber": null,
        "amount": this.invoicdata.lastmonthbill,
        "callPlan": this.invoicdata.callPlan,
        "deviceManufacture": "WebSelfcare",
        "deviceModel": "WebSelfcare",
        "deviceOs": "WebSelfcare",
        "imei": this.properties.getOSName(),
        "language": "0",
        "msisdn": this.invoicdata.msisdn,
        "paymentMethod": "",
        "secretKey": this.sessionService.getToken('secretKey'),
        "subscriberType": this.sessionService.getToken('subscriberType')
        
      }
    this.http.post(`/api/profile/postpaid/get-info`, data)
    .subscribe(r => {
      
      this.billingData = r;
      if(this.billingData._body){
        this.billingData = JSON.parse(this.billingData._body);
      }
    }, e => {
      // Handle Error
    });

     }

     selectPackage(){
      
      let subscribertype=  this.sessionService.getToken('subscriberType');
      let prodname;
      let accntno;
      if(subscribertype.toLowerCase() == 'postpaid'){
          prodname = 'Postpaid Payment';
          accntno = this.billingData.accountNumber;
      }else  if(subscribertype.toLowerCase() == 'hybrid'){
          prodname = 'Hybrid Payment';
          accntno = null;
      }
      
      var packageObj = {
           packagename: prodname,
           price: this.nominal, //this.billingData.amountInvoice
           paymentObj: this.selectedChannel,
           accountNumber: accntno
      }
      //this.properties.setpackage(packageObj);
      this.sessionService.removeToken('packageObj')
      this.sessionService.setToken('packageObj', JSON.stringify(packageObj));
      //if(Number(packageObj.price.replace(/\,/g,"")) > 0)
       this.router.navigate(['/billpayComponent']);
     
     }

     backtoprev(){
      let subscribertype=  this.sessionService.getToken('subscriberType').toLowerCase();
      if(subscribertype == 'hybrid'){
        this.router.navigate(['/tagihan-summary']);
      }else{
        this.router.navigate(['/3pascabayar']);
      }
      
     }

}
