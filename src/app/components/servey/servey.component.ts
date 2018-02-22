import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import { Router } from '@angular/router';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { Http } from '@angular/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Properties } from 'app/_helpers/properties';


@Component({
  selector: 'app-servey',
  templateUrl: './servey.component.html',
  styleUrls: ['./servey.component.css']
})
export class ServeyComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public sessionId: string;
  public msisdn: any;
  public satisfactionId;
  public responceData;
  public disableSubmit = false;
  public routurl: string;
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private interactionService: InteractionService,
    private http: Http,
    private properties: Properties,
  ) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
    this.msisdn = this.sessionService.getToken('msisdn');
    this.sessionId = this.sessionService.getToken('sessionId');
  }
  submitSurvey(form: NgForm): void {
    
    if ( form.controls['remark'].value !==  'undefined' && form.controls['satisfaction'].value !== 'undefined') {
      
      var json = "{\"userNumber\":\"" + this.msisdn + "\",\"remarks\":\"" + form.controls['remark'].value + "\",\"satisfactionId\":\"" + form.controls['satisfaction'].value + "\",\"operationType\":\"5\",\"sessionId\":\"" + this.sessionId + "\",\"userName\":\"" + this.sessionService.getToken('username') + "\"}";
      
      const chaturl = `/chat/csp-magent-client/WebchatServerlet?inputParam=${json}`;
      const str = chaturl.trim();
      this.disableSubmit = true;
      this.http.get(str)
      .subscribe(r => {
        this.responceData = r;
        if (this.responceData.status === 200 && this.responceData.ok === true ) {

          alert('Thank You for Feedback');
          this.routurl = this.properties.getActiveHeader();
          this.router.navigate( ['/'+ this.routurl]);
          this.sessionService.removeToken('chatsession');
        }
      }, e => {
          // Handle Error
          
      })
      
    } else {
     alert('Please fill Feedback form');
    }
  }
}
