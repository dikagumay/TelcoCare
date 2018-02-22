import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../_helpers/Session.service';
import { BsModalRef } from "ngx-bootstrap";
import { ModalShow } from '../../../_modals/modal.show';
import { BuyProductComponent } from "app/components/modals/buy-product/buy-product.component";
import { NavbarService } from "app/_services/NavbarService";
import { NavbarRequest } from "app/_interfaces/NavbarInterface";
import { APIConstants, AppConstant } from "app/_config/restapis";
import { HttpClient } from "@angular/common/http";
import { Properties } from '../../../_helpers/properties';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
import { PaymentSuccessComponent } from 'app/components/modals/payment-success/payment-success.component';
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import {environment} from '../../../../environments/environment';
@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent  {
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
  public message: string;
  public pay_url:string;

  constructor(private sessionService: SessionService, public bsModalRef: BsModalRef,
     public modal: ModalShow, private http: HttpClient, private properties:Properties,
     private interactionService: InteractionService) {
    
      this.modalList = this.properties.getItem();
      
      this.interactionService.languageToUseSubject.subscribe( data => {
        this.languageUse = data;
      })

  }

  ngOnInit() {
   this.subscriberType = this.sessionService.getToken('subscriberType'); 
   
  }

  openbuyModal() {
    this.closepopup();

    this.sessionService.removeToken('buyamnt');
    this.sessionService.setToken('buyamnt', this.selectedPrice);
    this.modal.showModal(BuyProductComponent, false, this.selectedPrice);
  }

  purchasePlan() {
    if(!this.selectedMethod) return; 
    this.closepopup();
    this.sessionService.removeToken('prodname');
    this.sessionService.setToken('prodname',this.modalList.productName);
    //if 1 go to confirmation page else call buy API, change methodname name validation with methodcode
    if (this.modalList.paymentMatrix[2] == 1 && this.modalList.paymentList[0].methodName.toLowerCase() === 'sms'){
        this.modal.showModal(BuyProductComponent, false, null); //needs to confirm
    } else {
      //buy call
      this.amount = Number(this.modalList.productPrice.replace(',','').replace('.',''));
      
      if( this.sessionService.getToken('RFUPay') == 'RFU'){
        
        this.redeemRFU();
      }else{
        
        if ((this.selectedMethod == '00') || (this.selectedMethod == '11' && this.subscriberType.toLowerCase() == 'hybrid')) {
          this.productPurchase();
        }else{
          this.paymentMode();
        } 
      }

      // amount, amountpaid, paymentmethodcode, Name , email, MSISDN, Secret key, subscriber type, Accountnumber
    
     

    }

  }

  redeemRFU(){
    const data = {
      msisdn: this.sessionService.getToken('msisdn'),
      imei: this.properties.getOSName(),
      deviceManufacture: '',
      deviceModel: '',
      deviceOs: '',
      language: 0,
      menuCategoryName: this.properties.getCategory(),
      menuSubCategoryName: this.properties.getSubCategory(),
      paymentMethod: this.selectedMethod,
      productId: this.modalList.productId,
      secretKey: this.sessionService.getToken('secretKey'),
      servicePlan: this.modalList.vendorList[0].priceList[0].planName,
      vendorId: this.modalList.vendorList[0].vendorId  
      
    };

    this.http.post(APIConstants.REDEEM, data)
    .subscribe(r => {
      
      this.paymentResp = r;
      this.properties.setPaymentResp(this.paymentResp);
      this.modal.showModal(PaymentSuccessComponent, false, null);
    }, e => {
      // Handle Error
    });

  }
  paymentMode() {
    this.closepopup();
    //if 1 go to confirmation page else call buy API
    //buy call
    
    //this.base_url = 'http://180.214.232.98:21084/payment-gateway/';
    this.base_url = environment.paymenturl;
    this.subscriberType = this.sessionService.getToken('subscriberType');
    this.Postpaiddata('product');
    
    window.open(this.url, "_self");
  }

  closepopup() {
    this.bsModalRef.hide();
  }

  Postpaiddata(type: string) {
        
        this.url = this.base_url + 'product?'
          + 'PRODUCTNAME=' + this.modalList.productName
          + "&AMOUNT=" + this.amount
          + "&NAME= You" 
          + "&EMAIL= you@h3i.com"
          + "&MSISDN=" + this.sessionService.getToken('msisdn')
          + "&PRODUCTID=" + this.modalList.productId
          + "&SERVICEPLAN=" + this.modalList.vendorList[0].priceList[0].planName
          + "&VENDORID=" + this.modalList.vendorList[0].vendorId
          + "&PAYMENTMETHODCODE=" + this.selectedMethod
          + "&SUBCATEGORY=" + this.properties.getSubCategory()
          + "&CATEGORY=" + this.properties.getCategory()
          + "&DEVICE=Device"
        
  }
  
 
  productPurchase() {
    
    const data = {
      msisdn: this.sessionService.getToken('msisdn'),
      imei:this.properties.getOSName(),
      secretKey: this.sessionService.getToken('secretKey'),
      language: 0,
      subscriberType: this.sessionService.getToken('subscriberType'),
      callPlan: this.sessionService.getToken('callPlan'),
      productId: this.modalList.productId,
      paymentMethod: this.selectedMethod,
      menuCategoryName: this.properties.getCategory(),
      menuSubCategoryName: this.properties.getSubCategory(),
      servicePlan: this.modalList.vendorList[0].priceList[0].planName,
      vendorId: this.modalList.vendorList[0].vendorId
    };


    this.http.post(APIConstants.PURCHASE_PRODUCT, data)
      .subscribe(r => {
        
        this.paymentResp = r;
        this.properties.setPaymentResp(this.paymentResp);
        this.modal.showModal(PaymentSuccessComponent, false, null);
      }, e => {
        // Handle Error
      });
  }
}
