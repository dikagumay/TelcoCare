import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import { PaymentMethodComponent } from "app/components/modals/payment-method/payment-method.component";
import { Properties } from "app/_helpers/properties";
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import {ModalShow} from '../../_modals/modal.show';
import { LANG_EN_TRANS } from 'app/_strings/lang-en';
import { InteractionService } from 'app/_services/Interaction.service';
@Component({
  selector: 'app-three-detail',
  templateUrl: './three-detail.component.html',
  styleUrls: ['./three-detail.component.css']
})
export class ThreeDetailComponent implements OnInit {

 public detailList: any;
 public productPurchase: boolean;
 public showmore: boolean;
 public videoflag:boolean;
 public producthowto: any;
 public labelhowto:any;
 public staticText = LANG_EN_TRANS;
 public languageUse: string;
 public rating:any;

  constructor(private sessionService: SessionService,  private properties:Properties, private modal:ModalShow,  private interactionService: InteractionService) { 
    this.detailList = JSON.parse(this.sessionService.getToken("three"));
    
    this.producthowto = this.detailList.productHowTo.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/;/g,'');
    this.labelhowto = this.detailList.labelHowTo.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/;/g,'');
    this.showmore = true;
    this.rating = Math.floor(Number(this.detailList.productRating));
    
        
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
  }

  openPopup(item){
    if(this.productPurchase){
      this.properties.setCategory("Three");
      this.properties.getSubCategory();
      
      this.properties.setItem(item);
      //this.sessionService.removeToken('home');
     // this.sessionService.setToken('home', JSON.stringify(item)); 
      this.modal.showModal(PaymentMethodComponent, false ,item);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, item);
    }
    }
    buttonbuy(){
      
    //  window.location.href= this.detailList.redirectLink;
     window.open(this.detailList.redirectLink, "_blank");
    }
  onNavigate(){
     
    //  window.location.href= this.detailList.redirectLink;
     window.open(this.detailList.redirectLink, "_blank");
   }

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
