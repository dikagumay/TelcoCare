import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/_helpers/Session.service';
import { Router } from '@angular/router';
import { NavbarService } from 'app/_services/NavbarService';
import { HttpClient } from '@angular/common/http';
import { Properties } from 'app/_helpers/properties';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { APIConstants, AppConstant } from 'app/_config/restapis';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { PaymentMethodComponent } from 'app/components/modals/payment-method/payment-method.component';
import { PurchaseInvalidComponent } from 'app/components/modals/purchase-invalid/purchase-invalid.component';
import { ModalShow } from 'app/_modals/modal.show';

@Component({
  selector: 'app-square-more',
  templateUrl: './square-more.component.html',
  styleUrls: ['./square-more.component.css']
})
export class SquareMoreComponent implements OnInit {
  public categoryId: any; 
  private PageNum = 1;
  public morePageList = [];
  public moreData;
  public flag: any;
  public subCategoryId: any;
  public productPurchase: boolean;
  public isHome: boolean;
  public pageNo:any;
  public catgName:string;
  public routerlink:any;
  public groupName:any;
  public flow:any;
  public defaultImagevalue: any;
  public showButton:boolean = true;
  constructor(private sessionService: SessionService,private router: Router,private modal: ModalShow,private http$: NavbarService,private http: HttpClient, private properties: Properties,private popupconfig: NgbPopoverConfig,) { 
    
    this.subCategoryId = this.sessionService.getToken("more");
    this.categoryId = this.sessionService.getToken('CategoryId');
    // this.flag=  this. sessionService.getToken('flag');
   this.flow= this. sessionService.getToken('flowhome');
    popupconfig.triggers = 'hover';
    this.groupName = this.sessionService.getToken('Groupname');

  }

  ngOnInit() {
    this.setCategoryName();
    this.pageNo = 1;
    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else {
      this.productPurchase = false;
    }

    if(this.categoryId == '-1'){
      this.isHome = true;
    }else{
      this.isHome = false;
    }
    
    if(this.categoryId == '5'){
      this.showButton = false;
    }else{
      this.showButton = true;
    }
    this.getMoreData(); //favorites

  }

  getMoreData(): void {
    if ( this.pageNo === 1) {
      this.morePageList = [];
    }
  
  const data: NavbarRequest = {
            deviceManufacture: '',
            deviceModel: '',
            deviceOs: '',
            imei: this.properties.getOSName(),
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
          this.getMoreData();
        } else {
          this.pageNo = 1;
        }
      }, e => {
        // Handle Error
      });
  
  
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
      window.open(detbanner.redirectLink, "_blank");
  }

  setCategoryName(){
    let catgId = Number(this.categoryId);
    switch (catgId) {
     case 1:
     this.catgName = 'movie';
     this.routerlink = "movie-detail";
     
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
     this.catgName = 'rfu'
 
   }
 
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
 
  setImage(id,event){
    switch (Number(id)) {
      case 2:
      this.defaultImagevalue = '../../../assets/img/DefaultMusic3.png'
        break;
      case 4:
      this.defaultImagevalue = '../../../assets/img/DefaultGame3.png' 
      break
      case 5:
      this.defaultImagevalue = '../../../assets/img/Default&CO3.png'
      break;
      default:
      this.defaultImagevalue = '../../../assets/img/DefaultTriProduct3.png'

    }
    event.target.src = this.defaultImagevalue;
  }

}
