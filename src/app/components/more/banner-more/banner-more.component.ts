import { Component, OnInit } from '@angular/core';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { AppConstant, APIConstants } from 'app/_config/restapis';
import { SessionService } from 'app/_helpers/Session.service';
import { GenHttpParams } from 'app/_helpers/Utils';
import { HttpClient } from '@angular/common/http';
import { Properties } from 'app/_helpers/properties';
import { Router } from '@angular/router';
import { PaymentMethodComponent } from 'app/components/modals/payment-method/payment-method.component';
import { PurchaseInvalidComponent } from 'app/components/modals/purchase-invalid/purchase-invalid.component';
import { ModalShow } from 'app/_modals/modal.show';
import { RecomendedAllRequest } from 'app/_helpers/Request.interface';

@Component({
  selector: 'app-banner-more',
  templateUrl: './banner-more.component.html',
  styleUrls: ['./banner-more.component.css']
})
export class BannerMoreComponent implements OnInit {
  public pageNo;
  public flag: any;
  public defaultImagevalue: any;
  public productBannerDetails = [];
  public categoryId: any;
  public subCategoryId: any;
  public bannerData: any;
  public flow:string;
  public catgName: string;
  public routerlink:any;
  public productPurchase:boolean;
  public showButton:boolean = true;
  public homeBannerDetails = [];
  constructor( private sessionService: SessionService,private http: HttpClient,private modal: ModalShow, private properties: Properties,private router: Router,) {
    this.subCategoryId = this.sessionService.getToken("more");
    this.categoryId = this.sessionService.getToken('CategoryId');
    this.flag=  this. sessionService.getToken('flag');
    //this.flow= this. sessionService.getToken('flowhome');
    this.setCategoryName()
   }

  ngOnInit() {
    this.pageNo = 1;
    if(this.flag == 'morebanner'){
      this.productBannerAll();
    }else if(this.flag== 'morehomebanner'){
      this.homeBannerAll();
    }

    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else {
      this.productPurchase = false;
    }
    if(this.categoryId == '5'){
      this.showButton = false;
    }else{
      this.showButton = true;
    }
  }

  productBannerAll(): void {
    if ( this.pageNo === 1) {
      this.productBannerDetails = [];
    }
    const data: NavbarRequest = {
      deviceManufacture: '',
      deviceModel: '',
      deviceOs: '',
      imei: this.properties.getOSName(),
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
      'imei': this.properties.getOSName(),
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


  openDetail(detail, item){ 
    this.setCategoryName();
    this.sessionService.removeToken(this.catgName);
    this.sessionService.setToken(this.catgName, JSON.stringify(item)); 
    this.properties.setProductId(detail.id2)
    this.properties.setSubCategory(detail.name);
    this.router.navigate(this.routerlink);
  }
  onNavigate(rfu, detbanner){
    if(this.flag == 'rfu')
    
      window.open(rfu.redirectLink, "_blank");
      else
      window.open(detbanner.redirectLink, "_blank");
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
  setCategoryName(){
   let catgId = Number(this.categoryId);
   switch (catgId) {
    // case 1:
    //   this.defaultImagevalue = '../../../assets/img/DefaultTriProduct2.png'
    //   break;
    case 1:
    this.catgName = 'movie';
    this.routerlink = ['/movie-detail'];
    
      break;
    case 2:
    this.catgName = 'music'
    this.routerlink = ['/music-detail'];
      break;
    case 3:
    this.catgName = 'three'
    this.routerlink = ['/three-detail'];
      break;
    case 4:
    this.catgName = 'game'
    this.routerlink = ['/game-detail'];
    break
    case 5:
    this.catgName = 'co'
    this.routerlink = ['/co-detail'];
    break;
    default:
    this.catgName = 'home'
    this.routerlink = ['/home-detail'];
  }

  }
  setImage(id,event){
    switch (Number(id)) {
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
    event.target.src = this.defaultImagevalue;
  }
  
}
