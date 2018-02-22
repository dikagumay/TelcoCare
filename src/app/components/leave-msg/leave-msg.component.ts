import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/_helpers/properties';
import { Http } from '@angular/http';
import { Logger } from 'app/_helpers/Logger';
import { SessionService } from 'app/_helpers/Session.service';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ModalShow } from 'app/_modals/modal.show';
import { SuccessModalComponent } from 'app/components/modals/success-modal/success-modal.component';
import { ProfileRequest } from 'app/_helpers/Request.interface';
import { APIConstants } from 'app/_config/restapis';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';

@Component({
  selector: 'app-leave-msg',
  templateUrl: './leave-msg.component.html',
  styleUrls: ['./leave-msg.component.css']
})
export class LeaveMsgComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public sessionId : string;
  public disableSubmit = false;
  public showEmail;
  public msisdn : any;
  public connectionResponse: any;
  public respObj: any;
  public msgResp:any;
  public form:NgForm;
  public email:string;
  public purpose:string;
  public reply:string;
  public profileData: any;
  public chettremResp: any;
  pattern = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
  show: boolean;
  public selectedTypeValue = '10220';
  public selectedReplyValue = '2'

  constructor(private router: Router, private properties:Properties,
    private http: Http,
    private console: Logger,
    private sessionService: SessionService, public modal: ModalShow,
    private interactionService: InteractionService) {
      this.showEmail = false;
    this.msisdn = this.sessionService.getToken('msisdn');
    this.email = this.sessionService.getToken('email');
   }

  ngOnInit() {  
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
  }

  

  leaveMessage(form: NgForm) {
    // console.log('message content::', form.value.msgcontnt);
    //  && form.value.serviceType !== "" && form.value.title from .value.userName !== ""
    if ( form.value.msgcontnt !== "" && form.value.serviceType !=="" && form.value.userName !== "") {
      if ( form.value.replyType === '1') {
       if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.value.email)) {
        this.connectChat(form);
        this.disableSubmit = true;
       } else {
         alert ( 'Please enter valid email Id');
       }

      } else {
        this.connectChat(form);
        this.disableSubmit = true;
      }
    } else {
      alert('Please Fill the form');
    }
  }

  connectChat(form) {
    console.log('chat care connect');

    var json = "{\"userNumber\":\"" +  this.msisdn + "\",\"userName\":\"" + form.value.userName + "\",\"clientIp\":\"169.254.4.31\",\"operationType\":\"1\",\"channelId\":\"003\",\"serviceType\":\"" + form.value.serviceType + "\"}";
   //var json = "{\"userNumber\":\"" + this.msisdn + "\",\"channelId\":\"003\",\"sendMessge\":\"" + this.chatTxt + "\",\"operationType\":\"2\",\"sessionId\":\"" + this.sessionId + "\",\"userName\":\"" + this.sessionService.getToken('username') + "\"}";
    let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;

    var conectionurl = chaturl.trim();
    
    this.http.get(conectionurl, null)
      .subscribe(r => {
        
        this.connectionResponse = r;
        this.respObj = JSON.parse((this.connectionResponse)['_body']);
        
        if(this.respObj.sessionId){
           this.properties.setChatSession(this.respObj.sessionId);
           this.sendMessage(form);
        }

      }, e => {
        // Handle Error
        

      });
  }
  change(e, type): void {
    if (type.form._value.replyType === '1') {
      this.showEmail = true;
    } else {
      this.showEmail = false;
    }

  }
  sendMessage(form){
    this.sessionId = this.properties.getChatSession();
    
    this.purpose = form.value.serviceType;
    this.reply = form.value.replyType;
    if(form.value.serviceType == '10220'){
      this.purpose = '3';
    }else{
      this.purpose = '1';
    }
   // this.email = (form.value.replyType== 'email'?'email':'');
   if(this.sessionService.getToken('emailid')){
     this.email = this.sessionService.getToken('email');
   }else{
     // this.email = form.value.userName + "@tri.com";
   }
   // var json = "{\"userNumber\":\"" + this.msisdn +"\",\"channelId\":\"015\",\"sendMessge\":\""+ form.value.msgcontnt +"\",\"operationType\":\"6\",\"sessionId\":\""+ this.sessionId +"\",\"userName\":\"" + form.value.userName +"\"}";
    var json = "{\"userNumber\":\"" + this.msisdn +"\",\"channelId\":\"003\",\"emailId\":\""+ this.email +"\",\"messagePrupose\":\""+ this.purpose +"\",\"replyVia\":\""+ this.reply +"\",\"linkMan\":\""+ form.value.userName +"\",\"title\":\""+ form.value.title +"\",\"content\":\""+ form.value.msgcontnt +"\",\"operationType\":\"6\",\"sessionId\":\""+ this.sessionId +"\",\"userName\":\"" + form.value.userName +"\"}";   
     let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
     var str = chaturl.trim();
     
     this.http.get(str, null)
       .subscribe(r => {
         
         this.msgResp = r;
         
         //var obj = JSON.parse(this.chatsendResp._body);
         //console.log(obj.resultDesc)
        //  if(this.chatsendResp.status === 200){
        //    this.chatReqArray.push(this.chatTxt);
        //    // this.chatTxt = '';
        //    this.timer = 0;
        //    this.interval = setInterval(() => {
        //     this.getChatResponse()
        //     },5000);
 
        //  }
        this.modal.show(SuccessModalComponent, false, null);
        this.disableSubmit = false;
        this.terminateSession(form);
        
       }, e => {
         // Handle Error
 
 
         
 
       });
  }
  
  terminateSession(form){
    var json = "{\"userNumber\":\"" + this.msisdn + "\",\"operationType\":\"4\",\"sessionId\":\"" + this.sessionId + "\",\"userName\":\"" + form.value.userName + "\"}";

    let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
    var str = chaturl.trim();
    
    this.http.get(str, null)
      .subscribe(r => {
        
        this.chettremResp = r;
        
  
        if (this.chettremResp.status === 200) {
          //let res_msg, workno,resultCode;
          //resultCode = (JSON.parse((this.chettremResp._body)))['resultCode'];
          //console.log('codeterminate',resultCode)
          
        }
  
      }, e => {
        // Handle Error
        
      });
  }
  

}
