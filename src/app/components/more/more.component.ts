import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { NavbarService } from '../../_services/NavbarService';
import { NavbarResponse } from '../../_interfaces/NavbarInterface';
import { APIConstants, AppConstant } from 'app/_config/restapis';
import { RecomendedAllRequest } from '../../_helpers/Request.interface';
import { HttpClient } from '@angular/common/http';
import { GenHttpParams } from 'app/_helpers/Utils';
import { Properties } from 'app/_helpers/properties';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethodComponent } from 'app/components/modals/payment-method/payment-method.component';
import { PurchaseInvalidComponent } from 'app/components/modals/purchase-invalid/purchase-invalid.component';
import { ModalShow } from 'app/_modals/modal.show';
import { InteractionService } from '../../_services/Interaction.service'

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css']
})
export class MoreComponent implements OnInit {
  public recomData;
  public rData;
  public RecomendedData;
  public productBannerDetails = [];
  public bannerData;
 public subCategoryId: any;
 public categoryId: any;
 private PageNum = 1;
  public morePageList = [];
  public moreData;
  public flag: any;
  public productPurchase: boolean;
  public isHome: boolean;
  public pageNo;
  public homeBannerDetails = [];
  public defaultImagevalue;
  public groupName:any;
  public flow:any;

  constructor(
    private sessionService: SessionService,
    private http$: NavbarService,
    private http: HttpClient,
    private properties: Properties,
    private popupconfig: NgbPopoverConfig,
    private modal: ModalShow,
    private interactionService: InteractionService

) { 
    this.subCategoryId = this.sessionService.getToken("more");
    this.categoryId = this.sessionService.getToken('CategoryId');
    this.flag=  this. sessionService.getToken('flag');
    this.flow= this. sessionService.getToken('flowhome');
    popupconfig.triggers = 'hover'; 
    this.groupName = this.sessionService.getToken('Groupname');
    // this.sessionService.getToken('Groupname');
    
   }

  ngOnInit() {
    // this.interactionService.pageNumberSubject.subscribe( data => {
    //   this.pageNo = data;
    // })
    this.pageNo = 1;
    if(this.flag == 'morebanner'){
      this.productBannerAll();
    }else if(this.flag== 'morehomebanner'){
      this.homeBannerAll();
    }else if(this.flag == 'rfu')
        this.moreOnIt(); //rfu
        else{
          if(this.categoryId == '-1'){
            this.isHome = true;
          }else{
            this.isHome = false;
          }
          
          if(this.flag == "undefined"){
            this.flag = 'product';
            
          }
          this.ThreeInit(); //favorites

        }
        

        if(this.flag == "undefined"){
          this.flag = 'product';
          
        }


        if (this.sessionService.checkKey('msisdn')) {
          this.productPurchase = true;
        }else {
          this.productPurchase = false;
        }

  }

    // On Page Load
  ThreeInit(): void {
    if ( this.pageNo === 1) {
      this.morePageList = [];
    }

 const data: NavbarRequest = {
            deviceManufacture: '',
            deviceModel: '',
            deviceOs: '',
            imei: AppConstant.imei,
            categoryId: this.categoryId,
            page: this. pageNo,
            callPlan: this.sessionService.getToken('callPlan'),           // Get from Storage
            language: this.sessionService.getToken('language'),          // Get from Storage
            msisdn: this.sessionService.getToken('msisdn'),             // Get from Storage
            subscriberType: this.sessionService.getToken('subscriberType'),     // Get from Storage
            secretKey: this.sessionService.getToken('secretKey'),      // Empty
            subCategoryId:  this.subCategoryId,  // Empty
            isHome: this.isHome
        };


 this.http$.getmorePageData(APIConstants.PRODUCT_PER_SUB_CATEGORY, this.PageNum, this.subCategoryId, data)
      .subscribe(r => {
        this.moreData = r;
        if ( this.moreData.length !== 0) {
          for (let i = 0; i < this.moreData.length; i++) {
            this.morePageList.push(this.moreData[i]);
          }
          
         // this.searchData.push(this.sData);
          this.pageNo++;
          this.ThreeInit();
        } else {
          this.pageNo = 1;
        }
      }, e => {
        // Handle Error
      });


  }
  moreOnIt(): void {
   
    const data1: RecomendedAllRequest = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': AppConstant.imei,
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
  productBannerAll(): void {
    if ( this.pageNo === 1) {
      this.productBannerDetails = [];
    }
    const data: NavbarRequest = {
      deviceManufacture: '',
      deviceModel: '',
      deviceOs: '',
      imei: AppConstant.imei,
      categoryId: this.categoryId,
      page: this.pageNo,
      callPlan: this.sessionService.getToken('callPlan'),           // Get from Storage
      language: this.sessionService.getToken('language'),          // Get from Storage
      msisdn: this.sessionService.getToken('msisdn'),             // Get from Storage
      subscriberType: this.sessionService.getToken('subscriberType'),     // Get from Storage
      secretKey: this.sessionService.getToken('secretKey'),      // Empty
      subCategoryId:  this.subCategoryId,  // Empty
      isHome: false
  };
  this.http.get(APIConstants.PRODUCT_BANNER_DETAIL, GenHttpParams(data)).
  subscribe( r => {
    
    this.bannerData = r;
    if ( this.bannerData.length !== 0) {
      for (let i = 0; i < this.bannerData.length; i++) {
        this.productBannerDetails.push(this.bannerData[i]);
      }
      
     // this.searchData.push(this.sData);
      this.pageNo++;
      this.productBannerAll();
    } else {
      this.pageNo = 1;
    }
  }, e => {
    
  })
  }

  homeBannerAll(){
    if ( this.pageNo === 1) {
      this.homeBannerDetails = [];
    }
    const data2: RecomendedAllRequest = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': AppConstant.imei,
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'page': this.pageNo,
      'secretKey': this.sessionService.getToken('secretKey'),
      'subscriberType': this.sessionService.getToken('subscriberType')
    }
  this.http.get(APIConstants.HOME_BANNER_ALL, GenHttpParams(data2)).
  subscribe( r => {
    
    this.bannerData = r;
    
    if ( this.bannerData.bannerList.length !== 0) {
      for (let i = 0; i < this.bannerData.bannerList.length; i++) {
        this.homeBannerDetails.push(this.bannerData.bannerList[i]);
      }
      
     // this.searchData.push(this.sData);
      this.pageNo++;
     this.homeBannerAll();
    } else {
      this.pageNo = 1;
    }
  }, e => {
    
  })
  }

  openDetail(detail, item, pagename){
    
    this.sessionService.removeToken(pagename);
    this.sessionService.setToken(pagename, JSON.stringify(item)); 
    
    this.properties.setProductId(detail.id2)
    this.properties.setSubCategory(detail.name);
  }
  onNavigate(rfu, detbanner){
    if(this.flag == 'rfu')
      window.open(rfu.redirectLink, "_blank");
      else
      window.open(detbanner.redirectLink, "_blank");
  }
  onRFUNavigate(detail){
    window.open(detail.redirectLink, "_blank");
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
  
  setImage(string, image,event){
    
        if(image == 'Products'){
    
          switch (string) {
            // case 1:
            //   this.defaultImagevalue = '../../../assets/img/DefaultTriProduct3.png'
            //   break;
            case 1:
            this.defaultImagevalue = '../../../assets/img/DefaultMovie3.png'
            
              break;
            case 2:
            this.defaultImagevalue = '../../../assets/img/DefaultMusic3.png'
            
              break;
            case 3:
            this.defaultImagevalue = '../../../assets/img/DefaultTriProduct3.png'
            
              break;
            case 4:
            this.defaultImagevalue = '../../../assets/img/DefaultGame3.png'
            
            break
            case 5:
            this.defaultImagevalue = '../../../assets/img/Default&CO3.png'
            break;
            default:
            this.defaultImagevalue = '../../../assets/img/RFU-Default.png'
      
          }
    
        }
        else{
    
          switch (string) {
            // case 1:
            //   this.defaultImagevalue = '../../../assets/img/DefaultTriProduct2.png'
            //   break;
            case 1:
            this.defaultImagevalue = '../../../assets/img/DefaultMovie1.png'
            
              break;
            case 2:
            this.defaultImagevalue = '../../../assets/img/DefaultMusic1.png'
            
              break;
            case 3:
            this.defaultImagevalue = '../../../assets/img/DefaultTriProduct1.png'
            
              break;
            case 4:
            this.defaultImagevalue = '../../../assets/img/DefaultGame1.png'
            
            break
            case 5:
            this.defaultImagevalue = '../../../assets/img/Default&CO1.png'
            break;
            default:
            this.defaultImagevalue = '../../../assets/img/RFU-Default.png'
      
          }
    
        }
        event.target.src = this.defaultImagevalue;
        
  
}
}

