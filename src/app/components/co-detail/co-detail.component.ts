import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../_helpers/Session.service';
import { LANG_EN_TRANS } from 'app/_strings/lang-en';
import { InteractionService } from 'app/_services/Interaction.service';


@Component({
  selector: 'app-co-detail',
  templateUrl: './co-detail.component.html',
  styleUrls: ['./co-detail.component.css']
})
export class CoDetailComponent implements OnInit {

  public detailList: any;
  public showmore: boolean;
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  public rating:any;
  constructor(private sessionService: SessionService, private interactionService: InteractionService) { 
    this.detailList = JSON.parse(this.sessionService.getToken("co"));
    this.rating = Math.floor(Number(this.detailList.productRating));
     
    
    this.showmore = true;
    
        
  }
 

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })

  }

   onNavigate(){
     
    //  window.location.href= this.detailList.redirectLink;
     window.open(this.detailList.redirectLink, "_blank");
   }
   onshowmore(){
    this.showmore= false;
  }
  onshowless(){
    this.showmore= true;
  }

  ngAfterViewChecked() {
    window.scrollTo(0, 0);
    }

}
