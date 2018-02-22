import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import {ModalShow} from '../../_modals/modal.show';
import { PaymentMethodComponent } from "app/components/modals/payment-method/payment-method.component";
import { PurchaseInvalidComponent } from "app/components/modals/purchase-invalid/purchase-invalid.component";
import { Properties } from "app/_helpers/properties";
import { LANG_EN_TRANS } from 'app/_strings/lang-en';
import { InteractionService } from 'app/_services/Interaction.service';


@Component({
  selector: 'app-music-detail',
  templateUrl: './music-detail.component.html',
  styleUrls: ['./music-detail.component.css']
})
export class MusicDetailComponent implements OnInit {

  public showmore: boolean;
  public detailList: any;
  public productPurchase: boolean;
  public producthowto: any;
  public labelhowto:any;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public rating: any;

  constructor(private sessionService: SessionService,  private properties:Properties, private modal:ModalShow,  private interactionService: InteractionService) { 

    this.detailList = JSON.parse(this.sessionService.getToken("music"));
    this.showmore = true;
    this.producthowto = this.detailList.productHowTo.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/;/g,'');
    this.labelhowto = this.detailList.labelHowTo.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/;/g,'');
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
  openDetailopenDetail(item){
    

    this.sessionService.menuCategoryName = "music";
    this.modal.showModal(PaymentMethodComponent, false ,item);
  }

  openPopup(item){
    if(this.productPurchase){
      this.properties.setCategory("Music");
      this.properties.getSubCategory();
      
      this.properties.setItem(item);
      //this.sessionService.removeToken('home');
     // this.sessionService.setToken('home', JSON.stringify(item)); 
      this.modal.showModal(PaymentMethodComponent, false ,item);
    }else{
      this.modal.showModal(PurchaseInvalidComponent, false, item);
    }
    }
    onNavigate(){
      
     //  window.location.href= this.detailList.redirectLink;
      window.open(this.detailList.redirectLink, "_blank");
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