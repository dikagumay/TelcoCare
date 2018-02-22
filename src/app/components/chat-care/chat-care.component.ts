import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { GenHttpParams, _numberOnly } from '../../_helpers/Utils';
import { Logger } from '../../_helpers/Logger';
import { SessionService } from '../../_helpers/Session.service';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { NavbarService } from '../../_services/NavbarService';
import { NavbarResponse } from '../../_interfaces/NavbarInterface';
import { APIConstants } from 'app/_config/restapis';
import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { Properties } from 'app/_helpers/properties';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';

@Component({
  selector: 'app-chat-care',
  templateUrl: './chat-care.component.html',
  styleUrls: ['./chat-care.component.css']
})
export class ChatCareComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public msisdn;
  public url;
  public config;
  public myParams;
  public myHeaders;
  public sessionId: string;
  // public options;
  public chatResponse: NavbarResponse;
  public connectionResponse: any;
  public respObj: any;
  public usernumber: any;
  public isDisabled: boolean = false;

  public serviceType = [
    {'id':'10220', 'name' : 'Complaint'},
    {'id':'10217', 'name' : 'Inquiry'}
  ];

  public selectedSevice = this.serviceType[0];
  

  constructor(
    private http: Http,
    private console: Logger,
    private sessionService: SessionService,
    private http$: NavbarService,
    private properties: Properties,
    private router: Router,
    private interactionService: InteractionService
  ) {
    
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    
    if(this.sessionService.getToken('msisdn')){
      this.usernumber = this.sessionService.getToken('msisdn');
    }
  }

  connectChat(form: NgForm) {
    if ( form.value.user === '' || form.value.user === 'undefined') {
      alert('Please fill the required form');
    }else {
     
      this.sessionService.removeToken('usernumber');
      this.sessionService.removeToken('username');
      this.sessionService.setToken('usernumber', form.value.usernumber);
      this.sessionService.setToken('username', form.value.user);
      var json = "{\"userNumber\":\"" +  this.sessionService.getToken('msisdn') + "\",\"userName\":\"" + form.value.user + "\",\"clientIp\":\"169.254.4.31\",\"operationType\":\"1\",\"channelId\":\"003\",\"serviceType\":\"" + form.value.service_Type + "\"}";
      let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
      var conectionurl = chaturl.trim();
      
      this.isDisabled = true;
      this.http.get(conectionurl, null)
        .subscribe(r => {
          
          this.connectionResponse = r;
          this.respObj = JSON.parse((this.connectionResponse)['_body']);
          
          if (this.respObj.sessionId) {
            this.sessionService.setToken('chatsessionId', this.respObj.sessionId);
            this.sessionService.removeToken('chatsession');
            this.sessionService.setToken('chatsession', 'fromchat');
            this.router.navigate(['/chat-box']);
          }
  
        }, e => {
          // Handle Error
          this.isDisabled = false;
          
  
        });
    }

  }

  keyPress(event: any) {
    return _numberOnly(event);
  }
}