import { Component, OnInit } from '@angular/core';
import { RecomendedAllRequest } from 'app/_helpers/Request.interface';
import { AppConstant, APIConstants } from 'app/_config/restapis';
import { ModalShow } from 'app/_modals/modal.show';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Properties } from 'app/_helpers/properties';
import { HttpClient } from '@angular/common/http';
import { NavbarService } from 'app/_services/NavbarService';
import { SessionService } from 'app/_helpers/Session.service';
import { PaymentMethodComponent } from 'app/components/modals/payment-method/payment-method.component';
import { PurchaseInvalidComponent } from 'app/components/modals/purchase-invalid/purchase-invalid.component';

@Component({
  selector: 'app-rfu-more',
  templateUrl: './rfu-more.component.html',
  styleUrls: ['./rfu-more.component.css']
})
export class RfuMoreComponent implements OnInit {
  private PageNum = 1;
  public recomData;
  public rData;
  public RecomendedData;
  public productPurchase: boolean;
  constructor(
    private sessionService: SessionService,
    private http$: NavbarService,
    private http: HttpClient,
    private properties: Properties,
    private popupconfig: NgbPopoverConfig,
    private modal: ModalShow) {
    
   }

  ngOnInit() {
    this.moreOnIt();
    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else {
      this.productPurchase = false;
    }
  }

  moreOnIt(): void {
    
     const data1: RecomendedAllRequest = {
       'callPlan': this.sessionService.getToken('callPlan'),
       'deviceManufacture': '',
       'deviceModel': '',
       'deviceOs': '',
       'imei': this.properties.getOSName(),
       'language': this.sessionService.getToken('language'),
       'msisdn': this.sessionService.getToken('msisdn'),
       'page': this.PageNum,
       'secretKey': this.sessionService.getToken('secretKey'),
       'subscriberType': this.sessionService.getToken('subscriberType')
     }
 
     
     this.http.post(APIConstants.RECOMENDED_ALL, data1).
     subscribe( r => {
       this.recomData = r;
       this.RecomendedData = this.recomData.products; 
     }, e => {
       
     })
   }
   
   onRFUNavigate(detail){
    window.open(detail.redirectLink, "_blank");
  }

  openDetail(detail, item, pagename){
    
    this.sessionService.removeToken(pagename);
    this.sessionService.setToken(pagename, JSON.stringify(item)); 
    this.sessionService.setToken('RFUPay','RFU');
    this.properties.setProductId(detail.id2)
    this.properties.setSubCategory(detail.name);
  }

  openPopup(item, detail){
    
    if(this.productPurchase){
      this.properties.setCategory("home");
      this.properties.setSubCategory(item.name);
      this.properties.setItem(detail); 
      this.modal.showModal(PaymentMethodComponent, false ,detail);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, detail);
    }
    
  }
  

}
