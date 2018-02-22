import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIConstants, AppConstant} from '../../_config/restapis';
import { Logger } from '../../_helpers/Logger';
import { SessionStorage } from '../../_helpers/Session.storage';
import { ChangeEmail } from '../../_helpers/Request.interface';
import { SessionService } from '../../_helpers/Session.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { Properties } from 'app/_helpers/properties';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public emailData;
  emailvalue: string;

  constructor(
    private console: Logger,
    private http: HttpClient,
    private sessionStorage: SessionStorage,
    private sessionService: SessionService,
    private interactionService: InteractionService,
    private properties: Properties,
  ) {
    this.emailvalue = this.sessionService.getToken('email');
   }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
  }
  changeEmail (): void {
    
    const data: ChangeEmail = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'email': this.emailvalue,
      'imei': this.properties.getOSName(),
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'secretKey': this.sessionService.getToken('secretKey')
    }
    this.http.post(APIConstants.CHANGE_EMAIL, data)
    .subscribe(r => {
      
      this.emailData = r;
      if (this.emailData.status === true) {
        alert('Email Changed succesfully');
        
        this.sessionService.setToken('email', this.emailvalue);
      }
    }, e => {
      
      // Handle Err
    });

  }
}
