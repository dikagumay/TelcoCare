import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { NavbarResponse } from 'app/_interfaces/NavbarInterface';
import { DOCUMENT } from '@angular/common';
import { NavbarService } from 'app/_services/NavbarService';
import { Logger } from 'app/_helpers/Logger';
import { SessionService } from '../../_helpers/Session.service';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { APIConstants } from 'app/_config/restapis';
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import { PaymentMethodComponent } from "app/components/modals/payment-method/payment-method.component";
import { ModalShow } from "app/_modals/modal.show";
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { Properties } from "app/_helpers/properties";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';



@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public MusicPageList: NavbarResponse;

  private CategoryId = '2';
  private PageNum = 1;
  public productPurchase: boolean;
  public config: SwiperConfigInterface;
  public bannerconfig:SwiperConfigInterface;
  public detbanner: any;
  

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http$: NavbarService,
    private sessionService: SessionService,
    private console: Logger,
    private modal:ModalShow,
    private properties:Properties,
    private interactionService: InteractionService
  ) { }


  ngAfterViewInit(){
    
    this.sessionService.removeToken('appheader');
    //this.sessionService.setToken('appheader','music');
  }


  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else{
      this.productPurchase = false;
    }
    this.ThreeInit();
  }

  // On Page Load
  ThreeInit(): void {


    // const data: NavbarRequest = {
    //         deviceManufacture: 'WebSelfcare',
    //         deviceModel: 'WebSelfcare',
    //         deviceOs: 'WebSelfcare',
    //         imei: 'WebSelfcare',
    //         categoryId:this. CategoryId,
    //         page:this. PageNum,
    //         callPlan: '',           // Get from Storage
    //         language: '0',          // Get from Storage
    //         msisdn: '',             // Get from Storage
    //         subscriberType: '',     // Get from Storage
    //         secretKey: '',      // Empty
    //         subCategoryId: '',  // Empty
    //         isHome: true
    //     };


//  this.http$.getmorePageData(APIConstants.PRODUCT_PER_CATEGORY,this.PageNum, this.CategoryId,data)
//       .subscribe(r => {
//         this.MusicPageList = r;

//         


//       }, e => {
//         // Handle Error
//       });
   this.http$.getPageData(this.PageNum, this.CategoryId)
     .subscribe(r => {
       this.MusicPageList = r;
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
    this.MusicPageList.detailList = [
      ...this.MusicPageList.detailList,
      ...res.detailList
    ];
  }
 
 //Detail page 
  openDetail(item){
    console.log(item);
    this.sessionService.removeToken('music');
    this.sessionService.setToken('music', JSON.stringify(item)); 
  }

  openPopup(item, detail){
    
    if(this.productPurchase){
      this.properties.setCategory("Music");
      this.properties.setSubCategory(item.name);
      
      this.properties.setItem(detail) 
      this.modal.showModal(PaymentMethodComponent, false ,detail);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, detail);
    }
    
  }

  openMore(item,moreflag,name){
    this.sessionService.removeToken('more');
    this.sessionService.setToken('more', item); 
    this.sessionService.removeToken('flag');
    this.sessionService.setToken('flag',moreflag); 
    this.sessionService.removeToken('CategoryId');
    this.sessionService.setToken('CategoryId', this.CategoryId);
    this.sessionService.removeToken('Groupname');
    this.sessionService.setToken('Groupname', name);
  }
  onNavigate(detail, detbanner){
    
   //  window.location.href= this.detailList.redirectLink;
    window.open(detbanner.redirectLink, "_blank");
  }

}
