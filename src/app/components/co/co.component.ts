import { NavbarService } from '../../_services/NavbarService';
import { NavbarResponse } from '../../_interfaces/NavbarInterface';
import { DOCUMENT } from '@angular/common';
import { Logger } from '../../_helpers/Logger';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { APIConstants } from 'app/_config/restapis';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Properties } from "app/_helpers/properties";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';






@Component({
  selector: 'app-co',
  templateUrl: './co.component.html',
  styleUrls: ['./co.component.css']
})
export class CoComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public CoPageList: NavbarResponse;

    private CategoryId = '5';
    private PageNum = 1;
    public config: SwiperConfigInterface;
  public bannerconfig:SwiperConfigInterface;
  public detbanner: any;

    constructor(
      @Inject(DOCUMENT) private document: Document,
      private http$: NavbarService,
       private sessionService: SessionService,
      private console: Logger,
      private properties:Properties,
      private interactionService: InteractionService
    ) { }

    ngOnInit() {
      this.interactionService.languageToUseSubject.subscribe(data => {
        this.languageUse = data;
      })
      this.ThreeInit();
    }

    // On Page Load
    ThreeInit(): void {
      // const data: NavbarRequest = {
      //       deviceManufacture: 'WebSelfcare',
      //       deviceModel: 'WebSelfcare',
      //       deviceOs: 'WebSelfcare',
      //       imei: 'WebSelfcare',
      //       categoryId:this. CategoryId,
      //       page:this. PageNum,
      //       callPlan: '',           // Get from Storage
      //       language: '0',          // Get from Storage
      //       msisdn: '',             // Get from Storage
      //       subscriberType: '',     // Get from Storage
      //       secretKey: '',      // Empty
      //       subCategoryId: '',  // Empty
      //       isHome: true
      //   };


//  this.http$.getmorePageData(APIConstants.PRODUCT_PER_CATEGORY,this.PageNum, this.CategoryId,data)
//       .subscribe(r => {
//         this.CoPageList = r;

//         console.log("mmmmmmmmmmmmmm",this.CoPageList)


//       }, e => {
//         // Handle Error
//       });
      this.http$.getPageData(this.PageNum, this.CategoryId)
        .subscribe(r => {
          this.CoPageList = r;
          this.config = this.properties.getConfig();
        this.bannerconfig = this.properties.getbannerConfig();
        }, e => {
          // Handle Error
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
      this.http$.getPageData(this.PageNum, this.CategoryId)
        .subscribe((r: NavbarResponse) => {
          this.appendData(r);
        }, e => {
          // Handle Nothing to show
        });
    }

    // Append http data to Existing data
    appendData(res: NavbarResponse): void {
      this.CoPageList.detailList = [
        ...this.CoPageList.detailList,
        ...res.detailList
      ];
    }
    //Detail page 
  openDetail(item){    
    this.sessionService.removeToken('co');
    this.sessionService.setToken('co', JSON.stringify(item)); 
  }
  openMore(item,moreflag,name){    
      this.sessionService.removeToken('more');
      this.sessionService.setToken('more', item); 
      this.sessionService.removeToken('flag');
      this.sessionService.setToken('flag',moreflag); 
      this.sessionService.removeToken('CategoryId');
      this.sessionService.setToken('CategoryId', this.CategoryId);
      this.sessionService.setToken('CategoryId', this.CategoryId);
      this.sessionService.removeToken('Groupname');
      this.sessionService.setToken('Groupname', name);

  }
  onNavigate(detail, detbanner){
    
   //  window.location.href= this.detailList.redirectLink;
    window.open(detbanner.redirectLink, "_blank");
  }
}
