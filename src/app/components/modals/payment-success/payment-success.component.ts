import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap";
import { Properties } from "app/_helpers/properties";
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
import { SessionService } from 'app/_helpers/Session.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  public modalData: any;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public prodName: string;
  constructor(public bsModalRef:BsModalRef, private properties:Properties,
    private interactionService: InteractionService, private sessionService: SessionService,private router: Router,) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
    
     this.modalData = this.properties.getPaymentResp();
     console.log(this.modalData);
     this.prodName = this.sessionService.getToken('prodname');
     
  }

  closepopup(){
    this.bsModalRef.hide();
    if(this.sessionService.getToken('RFUPay')){ // in rFU reload page
      window.location.reload();
    }
    
  }

}
