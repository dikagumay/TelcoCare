import { CommonService } from '../../_services/CommonService';
import { Logger } from '../../_helpers/Logger';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener, ViewChild, ElementRef, Inject } from '@angular/core';
import { InteractionService } from './../../_services/Interaction.service';
import { SessionStorage } from '../../_helpers/Session.storage';
import { Router } from '@angular/router';
import { SessionService } from '../../_helpers/Session.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from '../../_strings/lang-id';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { TranslateService } from '../../_strings/translate/translate.service';
import { Search } from '../../_helpers/Request.interface';
import { NotificationRequest } from '../../_helpers/Request.interface';
import { Properties } from 'app/_helpers/properties';
import { ModalShow } from 'app/_modals/modal.show';
import { ChatModelComponent } from 'app/components/modals/chat-model/chat-model.component';
import { DOCUMENT } from '@angular/platform-browser';

export interface HeaderIconArray {
  id: number;
  name: string;
  icon: string;
  iconSelected: string;
}

export interface HeaderIconReponse {
  data: HeaderIconArray[]
}

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  public keyword;
  public notificationData;
  public notificationArray;
  public staticText = LANG_EN_TRANS;
  public AppHeaderList;
  loginStatus: boolean;
  showSidebar = false;
  public notificationCount;
  public languageUse: string;
  public activeheader: string;
  public movieicon: string;
  public flag: string;
  public themeUrl;
  public themeList;
  isMac = false;
  uagent;
  @ViewChild('sidemenu') sidemenu: ElementRef;
  @ViewChild('hamburgerMenu') hamburgerMenu: ElementRef;
   
     @HostListener('document:touchstart', ['$event']) ontouchstart(e: TouchEvent) {
      this.uagent = navigator.platform.toLowerCase();
      if(this.uagent.indexOf("iphone") > -1 || this.uagent.indexOf("ipad") > -1 || this.uagent.indexOf("Android") > -1 || this.uagent.indexOf("BlackBerry") > -1 || this.uagent.indexOf("Windows") > -1){
        this.onOffMenu(e);
      }
   }

   @HostListener('document:click', ['$event']) onDocumentClick(e: MouseEvent) {
    this.uagent = navigator.platform.toLowerCase();
    if(this.uagent.indexOf("iphone") <= -1 || this.uagent.indexOf("ipad") <= -1 || this.uagent.indexOf("Android") <= -1 || this.uagent.indexOf("BlackBerry") <= -1 || this.uagent.indexOf("Windows") <= -1){
        this.onOffMenu(e);
    }
   }
  
  
  
  constructor(
    private loginInteraction: InteractionService,
    private console: Logger,
    private sessionStorage: SessionStorage,
    private router: Router,
    private http: HttpClient,
    private common: CommonService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private properties: Properties,
    private modal: ModalShow,    
    @Inject(DOCUMENT) private document:any
  ) {   

    if(localStorage.getItem("mac")){
      this.isMac = (localStorage.getItem("mac")=="true")?true:false;
    }

    if (this.sessionStorage.retrive('loginStatus')) {
      this.loginStatus = this.sessionStorage.retrive('loginStatus');
    } else {
    }
    if (this.loginStatus) {
      this.getNotification();
      this.themeNow();
    }
  }
  // sideClicked(event): void {
    
  // }

  onOffMenu(e) {
    if (this.hamburgerMenu.nativeElement.contains(e.target)) {
      // inside the sidemenu
      this.openslide();
    } else {
      // outside the sidemenu
      this.closeslide();
      //this.showSidebar = false;
    }
    this.keyword = '';
  }

  openslide() {
    this.document.body.style.overflow='hidden';
    this.showSidebar = true;
  };

  closeslide() {
    const self = this;
    setTimeout(() => self.document.body.style.overflow = 'auto', 2000);
    this.showSidebar = false;
  }
  //

  changeheader(select, url) {
    console.log(this.sessionService.getToken('chatsession'))
    this.properties.setActiveHeader(url);
    if(this.sessionService.getToken('chatsession') == 'fromchat'){
      this.modal.show(ChatModelComponent, false, null);
    }else{
      this.router.navigate(['/'+ url]);
    } 
    this.movieicon = select;
    localStorage.setItem("urlName", select);
  }

  

  ngOnInit() {
    this.activeheader = this.sessionService.getToken('appheader');
    
    this.loginInteraction.loginStatusSubject.subscribe(data => {
      this.loginStatus = data;
      
    });
    this.loginInteraction.notificationCountSubject.subscribe(data => {
      this.notificationCount = data;
      if (this.notificationCount === 0) {
        this.notificationCount = '';
      }
    });
    this.loginInteraction.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.getNavbarIcons();
    if(localStorage.getItem("urlName")){
      this.movieicon=localStorage.getItem("urlName");
    }
  }

  
  // Notification API
  getNotification(): void {
    let temp = 0;
    // Notification Request data
    const data: NotificationRequest = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': this.properties.getOSName(),
      'language': this.sessionService.getToken('language'),
      'lastId': 0,  // fixed
      'msisdn': this.sessionService.getToken('msisdn'),
      'secretKey': this.sessionService.getToken('secretKey')
    };
    this.http.post(APIConstants.NOTIFICATION, data).
      subscribe(r => {
        this.notificationData = r;
        this.notificationArray = this.notificationData.notifications;
        this.notificationArray.map(function (obj) {
          if (obj.isRead === '0') {
            temp++;
          }
        })
        if (temp !== 0) {
          this.notificationCount = temp;
        } else {
          this.notificationCount = '';
        }
        // this.notificationCount = this.notificationData.notifications.length;
        
        this.loginInteraction.setNotificationCount(this.notificationCount);
        this.loginInteraction.setNotificationData(this.notificationData);
      })
  }

  // Theme API
  themeNow(): void {
    // Made Common Service Class
    this.common.themeNow()
      .subscribe(r => {
        this.themeList = r;
        if(this.themeList.theme)
          this.themeUrl = this.themeList.theme.header;
      }, e => {
        // Err Handle
      });
  }

  getNavbarIcons(): void {
    this.http.get<HeaderIconReponse>(APIConstants.NAVBAR_MENU_ICONS)
      .subscribe(r => {
        this.AppHeaderList = r.data;
      }, e => {
        // Load Icons From Assets
      });
  }

  logOut(): void {
    this.common.logout()
      .subscribe(r => {
        this.sessionStorage.clearSession();
        this.loginStatus = false;
        this.loginInteraction.setNotificationCount('');
        this.router.navigate(['/login']);
      }, e => {
        // Handle Err
      });
  }
  search(): void {
    this.loginInteraction.setSearchData(this.keyword);
    this.changeheader('home', 'search');
    // this.router.navigate(['/search']);
  }
  menuChange(url){
    this.properties.setActiveHeader(url);
    if(this.sessionService.getToken('chatsession') !== 'fromchat')
      this.router.navigate(['/'+ url +'']);
      else
      this.modal.show(ChatModelComponent, false, null);
  }

}
