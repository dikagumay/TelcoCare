import { LoginInterface, LoginResponse } from '../../_helpers/Request.interface';
import { APIConstants, AppConstant } from '../../_config/restapis';
import { Logger } from '../../_helpers/Logger';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { config } from '../../_config/config';
import { SessionStorage } from '../../_helpers/Session.storage';
import { SessionService } from '../../_helpers/Session.service';
import { ModalSuccessComponent } from '../../_modals/success/modal.success';
import { InteractionService } from '../../_services/Interaction.service';
import { AuthService } from '../../_helpers/Auth.service';
import { Properties } from '../../_helpers/properties'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  pattern: any = /^[0-9]{1,20}$/;
  show: boolean;
  showPopUp:boolean;
  public otpRes;
  public loginRes;
  public temp;
  
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private console: Logger,
    private properties: Properties,
    private sessionStorage: SessionStorage,
    private loginInteraction: InteractionService,
    private sessionService: SessionService,
    private AUTH: AuthService
  ) { }
  
  // Generate Otp
  
  otpGenerate(form: NgForm): void {
    
    // Check Form valid & Hit OTPGenerate API
    if (form.value.msisdn) {
      
      // OTP request data
      const data: LoginInterface = {
        'callPlan': '',
        'deviceManufacture': '',
        'deviceModel': '',
        'deviceOs': '',
        'imei': this.properties.getOSName(),
        // 'imei': '510897104182148',
        'imsi': '',
        'language': '',
        'msisdn': form.value.msisdn,
        'otp': '',
        'secretKey': ''
      };
      
      
      // Rest API call
      
      this.http.post(APIConstants.OTP, data)
        .subscribe(r => {
          this.otpRes = r;
          
          if (this.otpRes.status === true) {
            //alert('OTP Send')
            this.showPopUp = true;           
            setTimeout(() =>{ this.showPopUp = false; }, 3000);
            
            this.show = true;
          }
        }, e => {
           // Show Err Modal
          
        });

    } else {
      // Handle Form Err
    }
  }

    // Login user
  login(form: NgForm): void {
    // Check Form valid & Hit Login API
    if (form.valid) {
      
      // Get Data from Form directly
      const data: LoginInterface = {
        'callPlan': '',
        'deviceManufacture': '',
        'deviceModel': '',
        'deviceOs': '',
        'imei':this.properties.getOSName(),
        'imsi': '',
        'language': '',
        'msisdn': form.value.msisdn,
        'otp': form.value.otp,
        'secretKey': ''
      };
      // Rest API call
      this.http.post<LoginResponse>(APIConstants.LOGIN, data)
        .subscribe(r => {
          this.loginRes = r;
          // Add Token to SessionStorage
          // Start Session InActivity timer
          
          if (this.loginRes.status === true) {
            
            this.sessionService.setToken('secretKey', this.loginRes.secretKey);
            this.sessionService.setToken('callPlan', this.loginRes.callPlan);
            this.sessionService.setToken('imei', this.loginRes.imei);
            this.sessionService.setToken('language', this.loginRes.language);
            this.sessionService.setToken('msisdn', this.loginRes.msisdn);
            this.sessionService.setToken('subscriberType', this.loginRes.subscriberType);
            // Route to HomePage
            this.router.navigate(['/home']);
            // set Login Status true
            // notify other component, using interaction service
            this.loginInteraction.changeLoginStatus(true);
            this.loginInteraction.changeLanguage(this.sessionService.getToken('language'));
            this.sessionService.setToken('loginStatus', true);
            // Set AUTH TOKEN using Auth service
            this.AUTH.setAuthToken(this.loginRes.secretKey);
          } else {
            alert(this.loginRes.message);
          }
        }, e => {
          // Handle Err
        });

    } else {
      // Handle Form Err Message
    }
  }
}
