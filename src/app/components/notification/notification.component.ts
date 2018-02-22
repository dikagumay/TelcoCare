import { Component, OnInit } from '@angular/core';
import { Logger } from '../../_helpers/Logger';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { HttpClient } from '@angular/common/http';
import { NotificationRequest, ProductDetail, ReadNotification } from '../../_helpers/Request.interface';
import { SessionStorage } from '../../_helpers/Session.storage';
import { InteractionService } from '../../_services/Interaction.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { SessionService } from '../../_helpers/Session.service';
import { Router } from '@angular/router'
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { NavbarService } from 'app/_services/NavbarService';
import { Properties } from '../../_helpers/properties'; 

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  public notificationArray;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public notificationData;
  public notificationCount;
  public productData;
  public subCatagoryId;
  public updatdata:any;
  public pageNo;
  public morePageList = [];
  public categoryId: any;
  public moreData: any;
  private PageNum = 1;
  public catId:string;
  constructor(
    private console: Logger,
    private http: HttpClient,
    private sessionStorage: SessionStorage,
    private interactionService: InteractionService,
    private sessionService: SessionService,
    private router: Router,
    private http$: NavbarService,
    private properties: Properties,
  ) { }

  ngOnInit() {
    this.notificationInIt();
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
    this.pageNo = 1;
  //  this.notificationInIt();
  // this.interactionService.notificationSubject.subscribe( data => {
  //   this.notificationData = data;
  //   this.console.log('[Notification:Init:Success', data);
  // })
  }
  notificationInIt(): void {
    let temp = 0;
    // Notification Request data
    const data: NotificationRequest = {
      'callPlan':  this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei':  this.properties.getOSName(),
      'language':  this.sessionService.getToken('language'),
      'lastId': 0,
      'msisdn':  this.sessionService.getToken('msisdn'),
      'secretKey':  this.sessionService.getToken('secretKey')
    };
    this.http.post(APIConstants.NOTIFICATION, data).
    subscribe( r => {
      this.notificationData = r;
      this.notificationArray = this.notificationData.notifications;
      this.notificationArray.map(function(obj){
        if ( obj.isRead === '0') {
          temp++;
        }
      })
      this.notificationCount = temp;
      // this.notificationCount = this.notificationData.notifications.length;
      
      this.interactionService.setNotificationCount(this.notificationCount);
    })
  }
  openNotification(notify, read: string, id: number): void {
    
    if ( read === '0') {
      const data: ReadNotification = {
        'callPlan': this.sessionService.getToken('callPlan'),
        'deviceManufacture': '',
        'deviceModel': '',
        'deviceOs': '',
        'id': id,
        'imei': this.properties.getOSName(),
        'language': this.sessionService.getToken('language'),
        'msisdn': this.sessionService.getToken('msisdn'),
        'secretKey': this.sessionService.getToken('secretKey')
      }
      this.http.post(APIConstants.READ_NOTIFICATION, data).
      subscribe( r => {
        this.updatdata = r;
        if(this.updatdata.status){
          notify.isRead = 1;
          this.notificationInIt();
        }
      }, e =>  {
        //
      })
    }
  }
  deleteNoti(id: number): void {
    const res = confirm('Are you sure want to delete this Notification?');
    if (res === true) {
      const data: ReadNotification = {
        'callPlan': this.sessionService.getToken('callPlan'),
        'deviceManufacture': '',
        'deviceModel': '',
        'deviceOs': '',
        'id': id,
        'imei': this.properties.getOSName(),
        'language': this.sessionService.getToken('language'),
        'msisdn': this.sessionService.getToken('msisdn'),
        'secretKey': this.sessionService.getToken('secretKey')
      }
    this.http.post(APIConstants.DELETE_NOTIFICATION, data).
    subscribe( r => {
      
      const ele = document.getElementById('' + id);
      ele.style.display = 'none';
    }, e =>  {
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
    'subscriberType': this.sessionService.getToken('subscriberType')
  }
  if (productId !== '') {
    this.http.post(APIConstants.PRODUCT_DETAIL, data).
    subscribe( r => {
      this.productData = r;
      this.sessionService.removeToken('home');
      this.sessionService.setToken('home', JSON.stringify(this.productData.product));
      this.router.navigate(['/home-detail'])
    }, e => {
  //
  })
  }
  }

  getProdPerSubcat(subcatId){
    let subCatagoryId = subcatId;
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
            subCategoryId:  subCatagoryId,  // Empty
            isHome: false // will decide later this.isHome
        };
  
  
  this.http$.getmorePageData(APIConstants.PRODUCT_PER_SUB_CATEGORY, this.PageNum, subCatagoryId, data)
      .subscribe(r => {
        this.moreData = r;
        if ( this.moreData.length !== 0) {
          for (let i = 0; i < this.moreData.length; i++) {
           // this.morePageList.push(this.moreData[i]);
            if ( this.moreData[i].categoryId !== -1){
              this.sessionService.removeToken('CategoryId');
              this.sessionService.setToken('CategoryId', this.moreData[i].categoryId);
              this.catId = this.moreData[i].categoryId;
              if(this.catId == null){
                this.router.navigate(['/rfumore']);
              }else{
                if(this.catId == '2' || this.catId == '4' || this.catId == '5'){
                  this.router.navigate(['/squaremore']);
                  }else{
                  this.router.navigate(['/portraitmore']);
                  }
              }
              
            }
            if(!this.catId){
              this.router.navigate(['/portraitmore']);
            }
             return; 
          }  
          
         
         
         // this.searchData.push(this.sData);
          // this.pageNo++;
          // this.getProdPerSubcat(subCatagoryId);
        } else {
          this.pageNo = 1;
        }
      }, e => {
        // Handle Error
      });

  }

  openMore(link: string,name, moreflag): void {
    this.subCatagoryId = link.substring(link.indexOf('id=') + 3, link.length);
    this.sessionService.removeToken('more');
    this.sessionService.setToken('more', this.subCatagoryId);
    this.sessionService.removeToken('flowhome');
    this.sessionService.setToken('flowhome', 'home'); 
    this.sessionService.removeToken('flag');
    this.sessionService.setToken('notfcnflag', 'notification');
    this.getProdPerSubcat(this.subCatagoryId);
    //based on category id we have to redirect it to potrait more or square more
   // this.router.navigate(['/more']);
  }
  openPage(link: string): void {
    window.open(link, '_blank');
  }
}
