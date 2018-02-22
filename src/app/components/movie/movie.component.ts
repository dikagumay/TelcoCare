import { Logger } from '../../_helpers/Logger';
import { NavbarService } from '../../_services/NavbarService';
import { NavbarResponse } from '../../_interfaces/NavbarInterface';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SessionService } from '../../_helpers/Session.service';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { APIConstants } from 'app/_config/restapis';
import { ModalShow } from "app/_modals/modal.show";
import { Properties } from "app/_helpers/properties";
import { PaymentMethodComponent } from "app/components/modals/payment-method/payment-method.component";
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public MoviePageList: NavbarResponse;

  private CategoryId = '1';
  private PageNum = 1;
  public productPurchase: boolean;  
  public config: SwiperConfigInterface;
  public bannerconfig:SwiperConfigInterface;
  public detbanner: any;
  public videoflag: boolean;
  public iframid: string;
 
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http$: NavbarService,
    private sessionService: SessionService,
    private console: Logger,
    private modal:ModalShow,
    private properties:Properties,
    private interactionService: InteractionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    });
    this.properties.removePlayedVideo();
    this.ThreeInit();
  }

  // On Page Load
  ThreeInit(): void {
    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else{
      this.productPurchase = false;
    }
    this.http$.getPageData(this.PageNum, this.CategoryId)
      .subscribe(r => {
        this.MoviePageList = r;
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
    this.MoviePageList.detailList = [
      ...this.MoviePageList.detailList,
      ...res.detailList
    ];
  }

   //Detail page 
  openDetail(item){
    
    this.sessionService.removeToken('movie');
    this.sessionService.setToken('movie', JSON.stringify(item)); 
    this.router.navigate(['/movie-detail']);
  }

  //payment popup
  openPopup(item, detail){
    
    if(this.productPurchase){
      this.properties.setCategory("Movie");
      this.properties.setSubCategory(item.name);
      
      this.properties.setItem(detail) 
      this.modal.showModal(PaymentMethodComponent, false ,detail);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, detail);
    }
    
  }
  
  openMore(item,moreflag,name){
    
      this.sessionService.removeToken('more');
      this.sessionService.removeToken('moreflag,banner')
      this.sessionService.setToken('more', item);
      this.sessionService.removeToken('CategoryId');
      this.sessionService.setToken('CategoryId', this.CategoryId);
      this.sessionService.removeToken('Groupname');
      this.sessionService.setToken('Groupname', name);
      this.sessionService.removeToken('flag');
      if(moreflag !== '')
      this.sessionService.setToken('flag',moreflag); 

  }
  onNavigate(detail, detbanner){
    
   //  window.location.href= this.detailList.redirectLink;
    window.open(detbanner.redirectLink, "_blank");
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
    }
}

