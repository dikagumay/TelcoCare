import { ProfileRequest, ProfileResponse } from '../../_helpers/Request.interface';
import { Component, OnInit } from '@angular/core';
import { Logger } from '../../_helpers/Logger';
import { SessionStorage } from '../../_helpers/Session.storage';
import { HttpClient } from '@angular/common/http';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { Router } from '@angular/router';
import { Observable } from '../../../../node_modules/rxjs';
import { SessionService } from '../../_helpers/Session.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { AsyncPipe } from '@angular/common';
import { Properties } from 'app/_helpers/properties';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public userData;
  public _userPostpaid;
  // public profileData: Observable<ProfileResponse>;
  public profileData;
  public packageList;
  isShow: boolean;

  constructor(
    private console: Logger,
    private http: HttpClient,
    private sessionStorage: SessionStorage,
    private router: Router,
    private sessionService: SessionService,
    private interactionService: InteractionService,
    private properties: Properties,
  ) {
    this.isShow = false;
    if (this.sessionService.checkKey('subscriberType')) {
      this._userPostpaid = this.sessionService.getToken('subscriberType');
    }
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.profileInIt();
  }

  profileInIt(): void {
    // this.userData = this.sessionStorage.retrive('userDetails');
    //  this.console.log("USER data in profile" + this.userData);

    const data: ProfileRequest = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei':this.properties.getOSName(),
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'secretKey': this.sessionService.getToken('secretKey'),
      'subscriberType': this.sessionService.getToken('subscriberType')
    }
    this.http.post(APIConstants.PROFILE, data)
      .subscribe(r => {
        
        this.profileData = r;
        this.packageList = this.profileData.packageList;
        this.sessionService.setToken('email', this.profileData.email);
      }, e => {
        
        // Handle Err
      });
  }
  unsuscribe(): void {
    
  }

}
