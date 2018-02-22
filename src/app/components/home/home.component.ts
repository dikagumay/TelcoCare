import { Observable } from 'rxjs/Rx';
import { CommonService } from '../../_services/CommonService';
import { ProfileRequest, RecomendedRequest, NotificationRequest } from '../../_helpers/Request.interface';
import { APIConstants } from '../../_config/restapis';
import { Logger } from '../../_helpers/Logger';
import { LoginInterface, AutoLoginInterface } from '../../_helpers/Request.interface';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SessionService } from '../../_helpers/Session.service';
import { InteractionService } from '../../_services/Interaction.service';
import { Properties } from '../../_helpers/properties'; 
import {ModalShow} from '../../_modals/modal.show';
import { PaymentMethodComponent } from "app/components/modals/payment-method/payment-method.component";
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import { AuthService } from '../../_helpers/Auth.service';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public homeList;
  public recommendedList;
  public themeList;
  public notificationData;
  public notificationCount = 0;
  public notificationArray;
  public productPurchase: boolean;
  public autoLoginData;
  public defaultImagevalue;
  public videoflag;

  public PageNum = 0;
  public config: SwiperConfigInterface;
  public bannerconfig:SwiperConfigInterface;
  public rfuConfig:SwiperConfigInterface;
  public detbanner: any;
  public rfu: any;
  private CategoryId = '-1';
  public videourl: any;
  public iframid: string;
  
 

  constructor(
    private console: Logger,
    private http: HttpClient,
    private common: CommonService,
    private sessionService: SessionService,
    private interactionService: InteractionService,
    private modal: ModalShow,
    private properties: Properties,
    private payment: PaymentMethodComponent,
    private httpcall: Http,
    private AUTH: AuthService,
    private popupconfig: NgbPopoverConfig,
    private sanitizer:DomSanitizer,
    private router: Router,
  ) { 
     popupconfig.triggers = 'hover'; 
     this.videoflag = false;
   
    
  }

  ngOnInit() {
    
    this.sessionService.removeToken('appheader');
    this.sessionService.setToken('appheader','home');
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.properties.removePlayedVideo();
    this.HomeInit();
    this.themeNow();

    if (this.sessionService.checkKey('msisdn')) {
      this.recomended();
      this.getNotification();
      this.productPurchase = true;
    }else {
      this.checkAutoLogin();
      this.productPurchase = false;
    }
    localStorage.removeItem('urlName');

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
    
    // this.defaultImagevalue = '../../../assets/img/Default&CO1.png'
    
    event.target.src = this.defaultImagevalue;
  }
  //check for auto login
  checkAutoLogin(): void {
    // tslint:disable-next-line:no-debugger
    const data: AutoLoginInterface = {
      'callPlan': '',
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': this.properties.getOSName(),
      'imsi': '',
      'language': '',
      'otp': '',
      'secretKey': ''
    }
     // Rest API call
     this.http.post(APIConstants.AUTOLOGIN, data)
     .subscribe(r => {
       this.autoLoginData = r;
      // alert('auto login called' + JSON.stringify(this.autoLoginData));
       if (this.autoLoginData.status === true) {         
         this.sessionService.setToken('secretKey', this.autoLoginData.secretKey);
         this.sessionService.setToken('callPlan', this.autoLoginData.callPlan);
         this.sessionService.setToken('imei', this.autoLoginData.imei);
         this.sessionService.setToken('language', this.autoLoginData.language);
         this.sessionService.setToken('msisdn', this.autoLoginData.msisdn);
         this.sessionService.setToken('subscriberType', this.autoLoginData.subscriberType);
         // set Login Status true
         // notify other component, using interaction service
         this.interactionService.changeLoginStatus(true);
         this.sessionService.setToken('loginStatus', true);
         // Set AUTH TOKEN using Auth service
         this.AUTH.setAuthToken(this.autoLoginData.secretKey);
       }
     }, e => {
       // Show Err Modal
     });
  }

  // Common Call For Load & Scroll
  HomePageInitCommon(pageNum: number = 0): Observable<any> {    
    const data = {
      deviceManufacture: 'WebSelfcare',
      deviceModel: 'WebSelfcare',
      deviceOs: 'WebSelfcare',
      imei: this.properties.getOSName(),
      page: pageNum,
      callPlan: this.sessionService.getToken('callPlan'), // Get from session Storage
      language: this.sessionService.getToken('language'), // Get from session Storage
      msisdn: this.sessionService.getToken('msisdn'), // Get from session Storage
      secretKey: this.sessionService.getToken('secretKey'), // Get from session Storage
      subscriberType: this.sessionService.getToken('subscriberType')// Get from session Storage
    };
    return this.http.post(APIConstants.HOMEPAGE.HOME, data);
  }

  // Home Page
  HomeInit(): void {
    this.HomePageInitCommon()
      .subscribe(r => {
        this.homeList = r;
        this.config = this.properties.getConfig();
        this.bannerconfig = this.properties.getbannerConfig();
        this.rfuConfig = this.properties.getRFUConfig();
      }, e => {
        // Handle Err
      });
      
  }

  // Bind Scroll Event
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body, html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      // Fire Event
      this.scrollLoad();
    }
  }

  // Call For Every Scroll Event
  scrollLoad(): void {
    ++this.PageNum;
    this.interactionService.setPageNumber(++this.PageNum);
    this.HomePageInitCommon(this.PageNum)
      .subscribe((r) => {
        this.appendData(r);
      }, e => {
        // Handle Nothing to show
      });
  }

  // Append http data to Existing data
  appendData(res): void {
    this.homeList.detailList = [
      ...this.homeList.detailList,
      ...res.detailList
    ];
  }

  // Theme API
  themeNow(): void {
    // Made Common Service Class
    this.common.themeNow()
      .subscribe(r => {
        this.themeList = r;
        if(this.themeList.theme)
          this.interactionService.setThemeData(this.themeList.theme.header);
      }, e => {
        // Err Handle
      });
  }

  // Notification API
  getNotification(): void {
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
      this.interactionService.setNotificationData(this.notificationData);
    })
  }

  // Recomended API
  recomended(): void {
    // Made Common Service Class
    this.common.recommended()
      .subscribe(r => {
        this.recommendedList = r;
        this.recommendedList['name'] = 'Recommended For You';
      }, e => {
        // Handle Err
      });
  }

  //Detail page 
  openDetail(detail, item){    
    this.sessionService.removeToken('prodname');
    this.sessionService.setToken('prodname',detail.name);
    this.sessionService.removeToken('home');
    this.sessionService.setToken('home', JSON.stringify(item)); 
    
    this.properties.setProductId(detail.id2)
    this.properties.setSubCategory(detail.name);
    this.router.navigate(['/home-detail']);
  }
  openPopup(item, detail, productType){   
    if(this.productPurchase){
      this.sessionService.removeToken('RFUPay');
      if(productType == 'RFU'){
        this.sessionService.setToken('RFUPay','RFU');
      }
      this.properties.setCategory("home");
      this.properties.setSubCategory(item.name);      
      this.properties.setItem(detail); 
      this.modal.showModal(PaymentMethodComponent, false ,detail);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, detail);
    }
    
  }
  openMore(item,moreflag,name, catId){
    this.sessionService.removeToken('flowhome');
    this.sessionService.setToken('flowhome', 'home'); 
    this.sessionService.removeToken('more');
    this.sessionService.setToken('more', item); 
    this.sessionService.removeToken('flag');
    this.sessionService.setToken('flag',moreflag); 
    this.sessionService.removeToken('CategoryId');
    this.sessionService.setToken('CategoryId', catId);
    this.sessionService.removeToken('Groupname');
    this.sessionService.setToken('Groupname', name);
    if(catId == 'seeAll'){
    this.router.navigate(['/morebanner']);
    }else if(catId == 'rfu'){
    this.router.navigate(['/rfumore']);
    }
    else{
    if(catId == '2' || catId == '4' || catId == '5'){
    this.router.navigate(['/squaremore']);
    }else{
    this.router.navigate(['/portraitmore']);
    }
    } 
    } 
    
    
  onNavigate(rfu, detbanner){    
    window.open(detbanner.redirectLink, "_blank");
  }
  onRFUNavigate(detail){
    window.open(detail.redirectLink, "_blank");
  }
  playVideo(url, index){ 
    if(this.properties.getPlayedVideo().length > 0){
      for(var i=0; i< this.properties.getPlayedVideo().length; i++){
        let ifrmId = 'iframe' + this.properties.getPlayedVideo()[i];
        let imgId = 'vidimg' + this.properties.getPlayedVideo()[i];
        let playId = 'playbtn' + this.properties.getPlayedVideo()[i];
        document.getElementById(ifrmId).remove(); //removed previoues played iframe
        document.getElementById(imgId).style.display = 'block'; // show image
        document.getElementById(playId).style.display = 'block'; //show playicon
      }
    }
   
    //empty the previous played array
    this.properties.removePlayedVideo();//newcode
    if(url.indexOf('youtu.be')){
      url = url.replace("youtu.be","youtube.com/embed");
    }
    if(url.indexOf('&feature=youtu.be')){
      url = url.split('&')[0];
    }
    this.bannerconfig.onAutoplayStop = true;
    this.bannerconfig.autoplay = 0;
    this.videoflag = true;
    this.iframid = 'ifrm' + index;    
    var elmId = 'ifr' + index;
    var imgid = 'vidimg' + index;
    let playbtnid = 'playbtn' +index;
    let ifrmId = 'iframe' + index;
    this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl(url.replace('watch?v=','embed/'));    
    let ifram = document.createElement('iframe');
    document.getElementById(imgid).style.display = 'none';
    document.getElementById(playbtnid).style.display = 'none';
    document.getElementById(elmId).appendChild(ifram).src = url.replace('watch?v=','embed/').concat('?autoplay=1').concat('&rel=0');
    //ifram.className ='ifrm-main';
    //puase the video , hide the other iframe , show image on other iframe
    ifram.setAttribute('id',ifrmId);
    this.properties.setPlayedVideo(index);//newcode
    ifram.style.height ='100%';
    ifram.style.width ='100%';
     // document.createAttribute('allowfullscreen');
     ifram.setAttribute('allowfullscreen','allowfullscreen');

    //this.swiper.stopAutoplay();
    
    }
    

}

