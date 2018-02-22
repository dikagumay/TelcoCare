import { RecomendedRequest } from '../_helpers/Request.interface';
import { Observable } from 'rxjs/Rx';
import { APIConstants } from '../_config/restapis';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../_helpers/Session.service';
import { Properties } from 'app/_helpers/properties';

@Injectable()
export class CommonService {
    constructor(
        private http: HttpClient,
        private sessionService: SessionService,
        private properties: Properties,
    ) { }

    // Theme API
    themeNow(): Observable<any> {
        return this.http.get(APIConstants.THEME);
    }

    // Logout API
    logout(): Observable<any> {
        const data = {
            deviceManufacture: 'WebSelfcare',
            deviceModel: 'WebSelfcare',
            deviceOs: 'WebSelfcare',
            imei: this.properties.getOSName(),
            imsi: ' WebSelfcare',
            language: this.sessionService.getToken('language'),
            callPlan: this.sessionService.getToken('callPlan'),  // Get from session Storage
            msisdn: this.sessionService.getToken('msisdn'), // Get from session Storage
            secretKey: this.sessionService.getToken('secretKey'), // Get from session Storage
            otp: '' // Empty
        };
        return this.http.post(APIConstants.LOGOUT, data);
    }

    // Recommended API
    recommended(pageNum: number = 1): Observable<any> {
        const data: RecomendedRequest = {
            deviceManufacture: 'WebSelfcare',
            deviceModel: 'WebSelfcare',
            deviceOs: 'WebSelfcare',
            imei: this.properties.getOSName(),
            page: pageNum,
            callPlan: this.sessionService.getToken('callPlan'), // Get from Session Storage
            language: this.sessionService.getToken('language'),  // Get from Session Storage
            msisdn: this.sessionService.getToken('msisdn'),  // Get from Session Storage
            secretKey: this.sessionService.getToken('secretKey'),  // Get from Session Storage
            subscriberType: this.sessionService.getToken('subscriberType')  // Get from Session Storage
        };
        return this.http.post(APIConstants.RECOMENDED, data);

    }
}
