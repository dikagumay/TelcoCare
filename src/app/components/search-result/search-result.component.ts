import { Component, OnInit } from '@angular/core';
import { Logger } from '../../_helpers/Logger';
import { Search } from '../../_helpers/Request.interface';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { SessionService } from '../../_helpers/Session.service';
import { InteractionService } from '../../_services/Interaction.service';
import { HttpClient } from '@angular/common/http';
import { ProductDetail } from '../../_helpers/Request.interface';
import { Router } from '@angular/router';
import { Properties } from '../../_helpers/properties';
import {ModalShow} from '../../_modals/modal.show';
import { PaymentMethodComponent } from 'app/components/modals/payment-method/payment-method.component';
import { PurchaseInvalidComponent } from 'app/components/modals/purchase-invalid/purchase-invalid.component';

import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from '../../_strings/lang-id';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { TranslateService } from '../../_strings/translate/translate.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public httpObservable;
  public keyword;
  public pageNo;
  public searchData :any;
  public Results = {};
  public sData;
  public productData;
  public productPurchase: boolean;
  public productId: string;
  public showmsg: boolean;
  public oldkeyword: string;
  public searchcall: any;
  
  constructor(
    private console: Logger,
    private sessionService: SessionService,
    private http: HttpClient,
    private interactionService: InteractionService,
    private properties: Properties,
    private modal: ModalShow,
    private payment: PaymentMethodComponent,
    private router: Router,
    
  ) {
    this.interactionService.searchDataSubject.subscribe( data => {
        this.keyword = data;
         //keyword change 
         if(this.oldkeyword !== this.keyword && this.pageNo){
          this.pageNo = 1;
          this.searchData = [];
          this.searchcall.unsubscribe(); //terminated 
          this.SearchKeyword();
        }else{
          this.SearchKeyword();
        }
        
    })
    // this.interactionService.pageNumberSubject.subscribe( data => {
    //   this.pageNo = data;
    // })
    this.pageNo = 1;
    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else {
      this.productPurchase = false;
    }
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
   this.SearchKeyword();
  }
  SearchKeyword(): void {
   
    if ( this.pageNo === 1) {
      this.searchData = [];
    }
    if(this.pageNo){
      const data: Search = {
        'callPlan': '',
        'deviceManufacture': '',
        'deviceModel': '',
        'deviceOs': '',
        'imei': this.properties.getOSName(),
        'keyword': this.keyword,
        'language': this.sessionService.getToken('language'),
        'msisdn': this.sessionService.getToken('msisdn'),
        'page': this.pageNo,
        'secretKey': this.sessionService.getToken('secretKey'),
        'subscriberType': this.sessionService.getToken('subscriberType')
      }
      this.searchcall = this.http.post(APIConstants.SEARCH, data).
      subscribe( r => {
        this.sData = [];
        this.sData = r;
        if ( this.sData.length !== 0) {
          
          for (let i = 0; i < this.sData.length; i++) {
            let product = this.sData[i].productId;
            
            if(this.searchData.hasOwnProperty(this.sData[i].productId)){
              this.searchData.splice(i,1);
              // this.searchData.push(this.sData[i]);  
            }else{
              this.searchData.push(this.sData[i]);  
              
            }
            this.oldkeyword = this.keyword;       
          }
          
          this.pageNo++;
          this.SearchKeyword();
        } else {
          if(this.searchData.length == 0)
            this.showmsg = true; 
          else
            this.showmsg = false;
          this.pageNo = 1;
          
        }
        
      }, e => {
      //
      })
    }
    
  }
  openProduct(el): void {
    const productId = el.currentTarget.id;
   
   const data: ProductDetail = {
    'callPlan': this.sessionService.getToken('callPlan'),
    'deviceManufacture': '',
    'deviceModel': '',
    'deviceOs': '',
    'imei': this.properties.getOSName(),
    'language': this.sessionService.getToken('language'),
    'msisdn': this.sessionService.getToken('msisdn'),
    'productId': '' + productId,
    'secretKey': this.sessionService.getToken('secretKey'),
    'subscriberType' : this.sessionService.getToken('subscriberType')
  }
  this.http.post(APIConstants.PRODUCT_DETAIL, data).
  subscribe( r => {
     this.productData = r;
    if (this.productData.product.categoryId === 1) {
      this.sessionService.removeToken('movie');
      this.sessionService.setToken('movie', JSON.stringify(this.productData.product));
      this.router.navigate(['/movie-detail']);
    } else {
      this.sessionService.removeToken('home');
      this.sessionService.setToken('home', JSON.stringify(this.productData.product));
      this.router.navigate(['/home-detail']);
    }
  }, e => {
//
})
  }
  onNavigate(url) {
    
   //  window.location.href= this.detailList.redirectLink;
    window.open(url, '_blank');
  }
  openPopup(detail) {
    
    if (this.productPurchase) {
      this.properties.setCategory('Search');
      this.properties.setSubCategory(detail.name);
      
      this.properties.setItem(detail);
      this.modal.showModal(PaymentMethodComponent, false , detail);
    }else {
      this.modal.showModal(PurchaseInvalidComponent, false, detail);
    }
  }


}
