import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { Router } from '@angular/router';
import { SessionService } from '../../_helpers/Session.service';
import { common } from '../../_helpers/Request.interface';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { Logger } from '../../_helpers/Logger';
import { child } from '../../_helpers/Request.interface'
import { Properties } from '../../_helpers/properties';


@Component({
  selector: 'app-share-kouta',
  templateUrl: './share-kouta.component.html',
  styleUrls: ['./share-kouta.component.css']
})
export class ShareKoutaComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public msisdn1;
  public msisdn2;
  public msisdn3;
  public childData;
  public selcted1 = true;
  public selcted2 = true;
  public selcted3 = true;
  public quota1 = '500MB';
  public quota2 = '500MB';
  public quota3 = '500MB';
  public showResend1 = false;
  public showResend2 = false;
  public showResend3 = false;
  constructor(
    private sessionService: SessionService,
    private interactionService: InteractionService,
    private router: Router,
    private http: HttpClient,
    private console: Logger,
    private properties: Properties,
    

  ) {  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.shareKoutaInIt();
  }
  shareKoutaInIt(): void {
    const data: common = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': this.properties.getOSName(), 
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'secretKey': this.sessionService.getToken('secretKey')
    }
    this.http.post(APIConstants.GET_CHILD, data).
    subscribe( r => {
      
      this.childData = r;
      if (this.childData.childs[0]) {
        this.msisdn1 = this.childData.childs[0];
        this.selcted1 = false;
        this.showResend1 = true;
        if (this.childData.childs[1]) {
          this.msisdn2 = this.childData.childs[1];
          this.selcted2 = false;
          this.showResend2 = true;
          if (this.childData.childs[2]) {
            this.msisdn3 = this.childData.childs[2];
            this.selcted3 = false;
            this.showResend3 = true;
          }
        }
      }
      
    }, e => {
      //
    })

  }
  change1(e, type): void {
    if (e.srcElement.checked) {
      
    this.selcted1 = true;
    } else {
    
    this.selcted1 = false;
    }

  }
  change2(e, type): void {
    if (e.srcElement.checked) {
      
    this.selcted2 = true;
    } else {
    
    this.selcted2 = false;
    }

  }
  change3(e, type): void {
    if (e.srcElement.checked) {
      
    this.selcted3 = true;
    } else {
    
    this.selcted3 = false;
    }

  }
  resendChild(num: string): void {
    const data: child = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': this.properties.getOSName(), 
      'isAction': 1,
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'msisdnChild': num,
      'productId': '',
      'secretKey': this.sessionService.getToken('secretKey')
    }
    this.http.post(APIConstants.CHILD_ACTION, data).
    subscribe( r => {
      //
    }, e => {
      //
    })
  }
  setChild(numb: string): void {
    const data: child = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': this.properties.getOSName(), 
      'isAction': 1,
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'msisdnChild': numb,
      'productId': '',
      'secretKey': this.sessionService.getToken('secretKey')
    }
    if ( numb !== '' && numb !== 'undefined') {
      this.http.post(APIConstants.CHILD_ACTION, data).
      subscribe( r => {
        alert('Msisdn Added succesfully');
        window.location.reload();
        //
      }, e => {
        //
      })
    }
  }

}
