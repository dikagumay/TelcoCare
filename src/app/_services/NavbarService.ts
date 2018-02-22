import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Properties } from 'app/_helpers/properties';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NavbarRequest } from 'app/_interfaces/NavbarInterface';
import { GenHttpParams } from 'app/_helpers/Utils';
import { APIConstants } from 'app/_config/restapis';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'app/_helpers/Session.service';

@Injectable()
export class NavbarService {
    constructor(private http: HttpClient, private sessionService: SessionService, private properties: Properties,) { 
        
    }

    getPageData(pageNum: number, CatId: string): Observable<any> {

        const data: NavbarRequest = {
            deviceManufacture: 'WebSelfcare',
            deviceModel: 'WebSelfcare',
            deviceOs: 'WebSelfcare',
            imei: this.properties.getOSName(),
            categoryId: CatId,
            page: pageNum,
            callPlan: '',           // Get from Storage
            language: this.sessionService.getToken('language'),          // Get from Storage
            msisdn: this.sessionService.getToken('msisdn'),             // Get from Storage
            subscriberType: this.sessionService.getToken('subscriberType'),     // Get from Storage
            secretKey: this.sessionService.getToken('secretKey'),      // Empty
            subCategoryId: '',  // Empty
            isHome: false
        };
        return this.http.get(APIConstants.PRODUCT_PER_CATEGORY, GenHttpParams(data));
    }


      getmorePageData(suburl:string, pageNum: number, CatId: string, data:NavbarRequest): Observable<any> {

          

        return this.http.get(suburl, GenHttpParams(data));
    }
    // getProductBannerAllCatatory(suburl: string, pageNum: number, CatId: string, data: NavbarRequest): Observable<any>{
    //     console.log('productAllBanner' + suburl);
    //     return this.http.get(suburl, GenHttpParams(data))
    // }



      getmorechatData(suburl:string, data:NavbarRequest): Observable<any> {

          

        return this.http.get(suburl, GenHttpParams(data));
    }
    getPostData(suburl:string, data:any): Observable<any> {
        return this.http.post(suburl, GenHttpParams(data))
    }

   
}
