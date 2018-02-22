import { Component, OnInit, HostListener } from '@angular/core';
import { Properties } from 'app/_helpers/properties';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Logger } from 'app/_helpers/Logger';
import { SessionService } from 'app/_helpers/Session.service';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import {ModalShow} from '../../_modals/modal.show';
import { ChatModelComponent } from 'app/components/modals/chat-model/chat-model.component';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public sessionId: string;
  public msisdn: any;
  public chatTxt: any;
  public sendMsgInterval: any;
  public interval: any;
  public chatinterval: any;
  public chatReqArray = [];
  public chatArray = [];
  public chatRespArray = [];
  public chatsendResp: any;
  public timer: number;
  public chatsendtxt: string;
  public agenchat: boolean = false;


  constructor(private router: Router, private properties: Properties,
    private http: Http,
    private interactionService: InteractionService,
    private console: Logger,
    private modal: ModalShow,
    private sessionService: SessionService, ) {
    this.msisdn = this.sessionService.getToken('msisdn');
    this.sessionId = this.sessionService.getToken('chatsessionId');
    
    this.router.events.subscribe((url:any) =>{
      
      if((this.router.url !== '/chat-box') && (this.router.url !== '/chat-care') && (this.router.url !== '/survey')){
        
        //this.terminateSession();
        this.sessionService.removeToken('chatsessionId');
        this.sessionService.removeToken('chatsession');
        clearInterval(this.interval);
        clearInterval(this.chatinterval);
      }
     })
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    // this.terminateSession();
    // this.properties.setActiveHeader(this.router.url);
    // this.sessionId = '';
    // clearInterval(this.interval);
    // clearInterval(this.chatinterval);
    //have to show the chatmodel
    // this.back();
    //have to hols back button
    this.modal.show(ChatModelComponent, false, null);
  }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
    })
  }
  
  back() {
    this.modal.show(ChatModelComponent, false, null);
  }

  startChat() {
    if(this.chatTxt=="") return; 
    //keep difference between two send messages 5sec
    if(this.chatTxt){
      this.chatinterval = setTimeout(() => {
        this.chatsendtxt = this.chatTxt;
        var json = "{\"userNumber\":\"" + this.msisdn + "\",\"channelId\":\"003\",\"sendMessge\":\"" + this.chatTxt + "\",\"operationType\":\"2\",\"sessionId\":\"" +  this.sessionService.getToken('chatsessionId')  + "\",\"userName\":\"" + this.sessionService.getToken('username') + "\"}";
        
        let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
        console.log('chat url',chaturl);
        var str = chaturl.trim();
        //clear chattext
        this.chatTxt = '';
        
        this.http.get(str)
        .subscribe(r => {
          
          this.chatsendResp = r;
          
          if (this.chatsendResp.status === 200) {
            this.chatReqArray.push(this.chatsendtxt);
            this.chatArray.push({type: 'req', val: this.chatsendtxt});
            this.timer = 0;
            this.interval = setInterval(() => {
              if(this.sessionService.getToken('chatsessionId'))
               this.getChatResponse()
            }, 5000);
  
  
          }
  
        }, e => {
          // Handle Error
          
  
        });
      }, 1000);
    }
    
   


  }

  getChatResponse() {
    var json = "{\"userNumber\":\"" + this.msisdn + "\",\"channelId\":\"003\",\"sendMessge\":\"" + this.chatsendtxt + "\",\"operationType\":\"3\",\"sessionId\":\"" + this.sessionService.getToken('chatsessionId') + "\",\"userName\":\"" + this.sessionService.getToken('username') + "\"}";
    
    let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
    var str = chaturl.trim();
    var resp_count = 0;
    
    this.http.get(str, null)
      .subscribe(r => {
        
        this.chatsendResp = r;
        console.log('chatsendresponse:',this.chatsendResp)

        if (this.chatsendResp.status === 200) {
          let res_msg, workno, resultCode, resultDesc;
          resultCode = (JSON.parse((this.chatsendResp._body)))['resultCode'];
          
          if (resultCode == 0) {
            workno = (JSON.parse((this.chatsendResp._body)))['workno'];
            
            if (workno) {
              if (workno !== "null") {
                
                res_msg = (JSON.parse((this.chatsendResp._body)))['receiveMessage'];
              }


              if (res_msg) {
                if (res_msg !== "null" && res_msg !== '/ctrl:2/' && res_msg !== '/ctrl:1/') {
                  this.chatRespArray.push(res_msg);
                  this.chatArray.push({type: 'res', val: res_msg.replace(/&lt/g,'<').replace(/&gt/g,'>').replace(/&amp/g,'&').replace(/;/g,'').trim()});
                 // this.chatTxt = '';
                  if(res_msg.indexOf('facebook') !== -1){
                    clearInterval(this.interval);
                    clearInterval(this.chatinterval);
                    this.terminateSession();
                    this.sessionService.removeToken('agentchat');
                    this.sessionService.setToken('agentchat', true);
                    this.modal.show(ChatModelComponent, false, null);
                  }
                }

                // if (res_msg.length > 0) {
                //   clearInterval(this.interval);
                // }
              }
            }
          } else if (resultCode == "2" || resultCode == "1") {
            
            clearInterval(this.interval);
            clearInterval(this.chatinterval);
            this.terminateSession();
          }
        }

      }, e => {
        // Handle Error
        
      });

  }
  terminateSession() {
    var json = "{\"userNumber\":\"" + this.msisdn + "\",\"operationType\":\"4\",\"sessionId\":\"" + this.sessionService.getToken('chatsessionId') + "\",\"userName\":\"" + this.sessionService.getToken('username') + "\"}";
    let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
    var str = chaturl.trim();
    this.http.get(str, null)
      .subscribe(r => {
        
        this.chatsendResp = r;
        

        if (this.chatsendResp.status === 200) {
          let res_msg, workno, resultCode;
          resultCode = (JSON.parse((this.chatsendResp._body)))['resultCode'];
          
          if (resultCode == 0) {
            this.chatsendtxt = '';
            this.sessionService.removeToken('chatsessionId');
          }

        }

      }, e => {
        // Handle Error
        
      });
  }


}
