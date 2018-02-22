import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/_helpers/properties';
import { BsModalRef } from 'ngx-bootstrap';
import { CommonService } from 'app/_services/CommonService';
import { SessionStorage } from 'app/_helpers/Session.storage';
import { InteractionService } from 'app/_services/Interaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.css']
})
export class SessionModalComponent implements OnInit {
  public tiemoutCounter: any;
  public loginStatus: boolean;
  constructor(private properties: Properties,public bsModalRef: BsModalRef, 
    private common: CommonService,
    private sessionStorage: SessionStorage,
    private loginInteraction: InteractionService,
    private router: Router,
  ) {
    //this.tiemoutCounter = this.properties.getCounter();
   }

  ngOnInit() {
    if(this.tiemoutCounter == 1){
      this.bsModalRef.hide();
    }
    if (this.sessionStorage.retrive('loginStatus')) {
      this.loginStatus = this.sessionStorage.retrive('loginStatus');
    }
  }
  closeModal(){
    this.bsModalRef.hide();
    this.common.logout()
    .subscribe(r => {
      this.sessionStorage.clearSession();
      this.loginStatus = false;
       this.router.navigate(['/login']);
    }, e => {
      // Handle Err
    });
  }

}
