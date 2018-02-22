import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeLanguage } from '../../_helpers/Request.interface';
import { Logger  } from '../../_helpers/Logger';
import { HttpClient } from '@angular/common/http';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { SessionStorage } from '../../_helpers/Session.storage';
import { SessionService } from '../../_helpers/Session.service';
import { InteractionService } from '../../_services/Interaction.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from '../../_strings/lang-id';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { TranslateService } from '../../_strings/translate/translate.service';
import { Properties } from '../../_helpers/properties';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public settingData;
  language: string;
  public settings = [
    {'id':'0', 'language' : 'Indonesia'},
    {'id':'1', 'language' : 'English'}
  ];
  public selectedLanguage = this.settings[0].language;
  constructor(
    private console: Logger,
    private http: HttpClient,
    private sessionStorage: SessionStorage,
    private sessionService: SessionService,
    private interactionService: InteractionService,
    private properties: Properties,

  ) {
    
   }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
    
    if (this.sessionService.checkKey('language')) {
      if ( this.sessionService.getToken('language') === '0') {
        this.language = 'Indonesia';
      } else {
        this.language = 'English';
      }

    } else {
      this.language = 'Indonesia';
    }
  }
  confirmSetting(){

  }
  selectLanguage(): void {
    let val;
   // const res = confirm('Are you sure want to change language?');
      if(this.selectedLanguage.toLowerCase() == 'english'){
          val = '1';
      }else{
        val =  '0';
      }

      this.sessionService.setToken('language', val);
      this.interactionService.changeLanguage(this.sessionService.getToken('language'));
      
      const data: ChangeLanguage =  {
        callPlan: this.sessionService.getToken('callPlan'),
        imei: this.properties.getOSName(),             // Can Be string / number
        language: val,
        msisdn: this.sessionService.getToken('msisdn'),
        secretKey: this.sessionService.getToken('secretKey'),
        subscriberType: this.sessionService.getToken('subscriberType')
      };
      if (this.sessionService.getToken('loginStatus')) {
        this.http.post(APIConstants.SETTINGS, data)
        .subscribe(r => {
          this.settingData = r;
          
          if (this.settingData.status === true) {
            if (val === '0') {
              this.language = 'Indonesia';
            } else {
              this.language = 'English';
            }
            this.sessionService.setToken('language', val);
            this.interactionService.changeLanguage(this.sessionService.getToken('language'));
          }

        }, e => {
          
          // Handle Err
        });
      } else {
        if (val === '0') {
          this.language = 'Indonesia';
        } else {
          this.language = 'English';
        }
        this.sessionService.setToken('language', val);
        this.interactionService.changeLanguage(this.sessionService.getToken('language'));
      }
    
  }
  retainLanguage(){
    if (this.selectedLanguage.toLowerCase() == 'english') {
      this.selectedLanguage = 'Indonesia';
    } else {
      this.selectedLanguage = 'English';
    }
  }
}
