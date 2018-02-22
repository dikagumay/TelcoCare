import { AppConstant } from '../_config/restapis';
export class Properties {
    public subCatgory: string;
    public category: string;
    public item:any;
    public paymentResp:any;
    public chatsession: string;
    public billingData: any;
    public buypackage: any;
    public productId : number;
    public activeheader: string;
    public routeurl: any;
    public playedVideo = [];
    public imeiNo: string;
    public osname: string;
   
       setSubCategory(name:string){
           this.subCatgory = name;
       }
       
       getSubCategory(){
           
           return this.subCatgory;
       }
   
       setCategory(category:string){
           this.category = category;
       }
   
       getCategory(){
           return this.category;
       }
   
       setItem(item:any){
           this.item = item;
       }
       getItem(){
           return this.item;
       }
   
       setPaymentResp(paymentResp:object){
           this.paymentResp = paymentResp;
       }
   
       getPaymentResp(){
           return this.paymentResp;
       }
   
       setChatSession(sessionid: string){
           this.chatsession = sessionid;
       }
   
       getChatSession(){
           return this.chatsession;
       }
   
       setBillingData(billlingData: object){
           this.billingData = billlingData;
       }
   
       getBillingData(){
           return this.billingData;
       }
   
       setpackage(buypackage: object){
           this.buypackage = buypackage;
       }
   
       getpackage(){
           return this.buypackage;
       }
   
       public getbannerConfig(){
             return {
               scrollbar: null,
               scrollbarHide: false,
               keyboardControl: true,
               mousewheelControl: false,
               scrollbarDraggable: true,
               scrollbarSnapOnRelease: true,
               nextButton: '.swiper-button-next',
               prevButton: '.swiper-button-prev',
               autoplay:2000,
               spaceBetween: 0,
               breakpoints: {
                   // when window width is <= 320px
                   320: {
                     slidesPerView: 'auto',
                   
                   },
                   // when window width is <= 480px
                   480: {
                       slidesPerView:'auto',
                    
                   },
                   // when window width is <= 640px
                   640: {
                       slidesPerView:'auto',
                    
                   },
                   768: {
                    slidesPerView: 1,
                 
                    },
                   1024:{
                       slidesPerView: 3,
                       
                   },
                  
                   1366:{
                       slidesPerView: 3,
                      
                   }
                   
                 }
             };
       }
   
       public getConfig(){
           return {
               scrollbar: null,
               scrollbarHide: false,
               keyboardControl: true,
               mousewheelControl: false,
               scrollbarDraggable: true,
               scrollbarSnapOnRelease: true,
               nextButton: '.swiper-button-next',
               prevButton: '.swiper-button-prev',
               // breakpoints: {
               //     // when window width is <= 320px
               //     320: {
               //         slidesPerColumn: 1,
               //         slidesPerGroup:1
               //     },
               //     // when window width is <= 480px
               //     480: {
               //         slidesPerColumn: 1,
               //         slidesPerGroup:1
               //     },
               //     // when window width is <= 640px
               //     640: {
               //         slidesPerColumn: 1,
               //         slidesPerGroup:1
               //     },
               //     1024:{
               //         slidesPerView:'auto'
               //     },
               //     1366:{
               //         slidesPerView:'auto'
               //     }
               //   }
                 slidesPerView:'auto'
             };
       
       }
   
       public getRFUConfig(){
           return {
               scrollbar: null,
               scrollbarHide: false,
               keyboardControl: true,
               mousewheelControl: false,
               scrollbarDraggable: true,
               scrollbarSnapOnRelease: true,
               nextButton: '.swiper-button-next',
               prevButton: '.swiper-button-prev',
               disableOnInteraction: false,
               breakpoints: {
                   // when window width is <= 320px
                   320: {
                       slidesPerView: 2,
                   },
                   // when window width is <= 480px
                   480: {
                       slidesPerView: 2,
                   },
                   // when window width is <= 640px
                   640: {
                       slidesPerView: 2,
                   },
                   1024:{
                       slidesPerView: 2,
                   },
                   1366:{
                       slidesPerView:'auto'
                   }
                 }
             };
               
               
       }      
   
   public setProductId(id:number){
   this.productId = id;
   }
   public getProductId(){
       return this.productId;
   }
   
   public setActiveHeader(header: any){
       this.activeheader = header;
   }
   
   public getActiveHeader(){
     return  this.activeheader ;
   }
   
   public setActiveurl(routurl:any){
       this.routeurl = routurl;
   }
   
   public getActiveurl(){
       return this.routeurl;
   }
   
   public setPlayedVideo(id: any){
       this.playedVideo.push(id);
   }
   
   public removePlayedVideo(){
       this.playedVideo = [];
   }
   
   public getPlayedVideo(){
       return this.playedVideo;
   }

   public getOSName(){
    //this.osname = window.navigator.userAgent.trim();
    this.osname = window.navigator.platform.trim(); 
       console.log('osname::'+this.osname)
      
      if(this.osname.toLowerCase().indexOf('android') !== -1 ){
           this.imeiNo = AppConstant.android_imei;
           console.log('android')
         }else if(this.osname.toLowerCase().indexOf('iphone') !== -1 || this.osname.toLowerCase().indexOf('mac') !== -1 || this.osname.toLowerCase().indexOf('safari') !== -1){
         this.imeiNo = AppConstant.mac_imei;
         console.log('found')
       }else{
         this.imeiNo = 'WebSelfcare';
       }
       return this.imeiNo;
   }
  
   
   }
   
