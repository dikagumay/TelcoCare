import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../../_strings/lang-en';
import { TranslatePipe } from '../../../_strings/translate/translate.pipe';
import { InteractionService } from '../../../_services/Interaction.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { SessionService } from 'app/_helpers/Session.service';


@Component({
  selector: 'app-chat-model',
  templateUrl: './chat-model.component.html',
  styleUrls: ['./chat-model.component.css']
})
export class ChatModelComponent implements OnInit {
  public msg: String;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public chatsendResp: any;
  public agentchat:any;
  constructor(public bsModalRef: BsModalRef, private interactionService: InteractionService, private sessionService: SessionService, private router: Router,private http: Http) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe( data => {
      this.languageUse = data;
      this.agentchat = this.sessionService.getToken('agentchat');
    })
  }
  noModal() {
    this.bsModalRef.hide();
  }
  yesModal() {
    this.bsModalRef.hide();
    this.terminateSession();
    if(this.agentchat){
      this.router.navigate(['/contact-tri']);
      this.sessionService.removeToken('agentchat');
    }else{
      this.router.navigate(['/survey']);
    }
    
  }

  terminateSession() {
    var json = "{\"userNumber\":\"" + this.sessionService.getToken('msisdn') + "\",\"operationType\":\"4\",\"sessionId\":\"" + this.sessionService.getToken('chatsessionId') + "\",\"userName\":\"" + this.sessionService.getToken('username') + "\"}";
    let chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
    var str = chaturl.trim();
    this.http.get(str, null)
      .subscribe(r => {
        
        this.chatsendResp = r;
        

        if (this.chatsendResp.status === 200) {
          let res_msg, workno, resultCode;
          resultCode = (JSON.parse((this.chatsendResp._body)))['resultCode'];
          
          if (resultCode == 0) {
           // this.chatsendtxt = '';
           this.sessionService.removeToken('chatsessionId');
          }

        }

      }, e => {
        // Handle Error
        
      });
  }
}
