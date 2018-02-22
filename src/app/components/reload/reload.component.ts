import { Component, OnInit } from '@angular/core';
import { Logger } from '../../_helpers/Logger';
import { ReloadVoucher } from '../../_helpers/Request.interface';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../_helpers/Session.service';
import { Router } from '@angular/router';
import { LANG_EN_NAME, LANG_EN_TRANS } from '../../_strings/lang-en';
import { TranslatePipe } from '../../_strings/translate/translate.pipe';
import { InteractionService } from '../../_services/Interaction.service';
import { Properties } from 'app/_helpers/properties';

@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.css']
})
export class ReloadComponent implements OnInit {
  public staticText = LANG_EN_TRANS;
  public languageUse: string;
  pattern: any = /^[0-9]{1,16}$/;
  public voucherValue;
  public voucherData;

  constructor(
    private console: Logger,
    private http: HttpClient,
    private sessionService: SessionService,
    private router: Router,
    private interactionService: InteractionService,
    private properties: Properties,
  ) { }

  ngOnInit() {
    this.interactionService.languageToUseSubject.subscribe(data => {
      this.languageUse = data;
    })
  }
  reloadVoucher(): void {
    const data: ReloadVoucher = {
      'callPlan': this.sessionService.getToken('callPlan'),
      'deviceManufacture': '',
      'deviceModel': '',
      'deviceOs': '',
      'imei': this.properties.getOSName(),
      'language': this.sessionService.getToken('language'),
      'msisdn': this.sessionService.getToken('msisdn'),
      'secretKey': this.sessionService.getToken('secretKey'),
      'voucherNumber': this.voucherValue
    }
    this.http.post(APIConstants.RELOAD, data)
    .subscribe(r => {
      this.voucherData = r;
      if (this.voucherData.status === true) {
        
        alert('Voucher Done');
        this.router.navigate(['/profile']);
      }else {
        alert(this.voucherData.message);
      }
    }, e => {
      
      // Handle Err
    });
  }
}
