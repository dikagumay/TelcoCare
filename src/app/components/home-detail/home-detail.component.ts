import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import {ModalShow} from '../../_modals/modal.show';
import { PaymentMethodComponent } from "app/components/modals/payment-method/payment-method.component";
import { Properties } from "app/_helpers/properties";
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { InteractionService } from '../../_services/Interaction.service';


@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.css']
})
export class HomeDetailComponent implements OnInit {
  public showmore: boolean;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public detailList: any;
  public productPurchase: boolean;
  public productId:number;
  public abc :any= "iuewghrtiuherituhewihrui";
  public videoflag:boolean;
  public prodname: any;
  public producthowto: any;
  public labelhowto:any;
  public rating:any;
 
  constructor(private sessionService: SessionService,  private modal:ModalShow, private properties:Properties,   private interactionService: InteractionService) { 
    this.detailList = JSON.parse(this.sessionService.getToken("home"));    
    this.productId = this.properties.getProductId();     
    this.showmore = true;
    this.prodname = this.sessionService.getToken('prodname');        
    this.producthowto = this.detailList.productHowTo.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/;/g,'');
    this.labelhowto = this.detailList.labelHowTo.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/;/g,'');
    this.rating = Math.floor(Number(this.detailList.productRating));
  }

  ngOnInit() {
    if (this.sessionService.checkKey('msisdn')) {
      this.productPurchase = true;
    }else{
      this.productPurchase = false;
    }
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
  }

  openPopup(item){
    if(this.productPurchase){
      this.properties.setCategory("Home");
      this.properties.getSubCategory();      
      this.properties.setItem(item);
      //this.sessionService.removeToken('home');
     // this.sessionService.setToken('home', JSON.stringify(item)); 
     this.sessionService.removeToken('RFUPay');
     if(this.sessionService.getToken('prodname') == 'Recommended For You'){
       this.sessionService.setToken('RFUPay','RFU');
     }
      this.modal.showModal(PaymentMethodComponent, false ,item);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, item);
    }
    }
    onNavigate(){      
    //  window.location.href= this.detailList.redirectLink;
     window.open(this.detailList.redirectLink, "_blank");
    }
    // replaceLine(str: string){    
    //   let desstrng = new RegExp('&lt;br /&gt;','gaurav');    
    //   this.abc= desstrng;
    // }

    playVideo(url){ 
      if(url.indexOf('youtu.be')){
        url = url.replace("youtu.be","youtube.com/embed");
      }
      if(url.indexOf('&feature=youtu.be')){
        url = url.split('&')[0];
      }
      this.videoflag = true;
      let ifram = document.createElement('iframe');
      document.getElementById('bannerimg').style.display = 'none';
      document.getElementById('playvid').style.display = 'none';
      document.getElementById('maindiv').appendChild(ifram).src = url.replace('watch?v=','embed/').concat('?autoplay=1').concat('&rel=0');
      ifram.style.height ='60vh';
      ifram.style.width ='100%';
      ifram.style.border ='0px';
    }


    onDownload(){
      
      window.open(this.detailList.downloadLink, "_blank");
    }
    onshowmore(){
      this.showmore= false;
    }
    onshowless(){
      this.showmore= true;
    }
    ngAfterViewChecked() {
      window.scrollTo(0, 0);
      }
    
  }


