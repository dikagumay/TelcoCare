import { common } from 'app/_helpers/Request.interface';
import { MetadataBannerList, MetadataDetailList } from 'app/_interfaces/_commonInterface';

export interface NavbarRequest extends common {
    categoryId: string;
    subCategoryId: string;
    page: number;
    subscriberType: string;
    isHome: boolean;
}




export interface NavbarResponse {
    bannerList: BannerList[],
    detailList: DetailList[]
}
// BannerList
export interface BannerList {
    productId: string;
    productName: string;
    productPrice: string;
    productDescription: string;
    productHowTo: string;
    productPricing: string;
    labelDescription: string;
    labelHowTo: string;
    labelPricing: string;
    buttonBuy: string;
    productRating: number;
    categoryId: number;
    paymentMatrix: number[];
    isRedirectToLink: boolean;
    redirectLink: string;
    isDownloadLink: boolean;
    downloadLink: string;
    metadata: MetadataBannerList;
    vendorList: VendorList[];
    paymentList: PaymentList[];
}


// Detail List
export interface DetailList {
    id: number;
    id2: number;
    name: string;
    productList: ProductList[];
}
export interface ProductList {
    productId: string;
    productName: string;
    productPrice: string;
    productDescription: string;
    productHowTo: string;
    productPricing: string;
    labelDescription: string;
    labelHowTo: string;
    labelPricing: string;
    buttonBuy: string;
    productRating: number;
    categoryId: number;
    paymentMatrix: number[];
    isRedirectToLink: boolean;
    redirectLink: string;
    isDownloadLink: boolean;
    downloadLink: string;
    metadata: MetadataDetailList; // Meta Data Common
    vendorList: VendorList[];
    paymentList: PaymentList[];
}
export interface VendorList {
    vendorId: number;
    vendorName: string;
    priceList: PriceList[];
}
export interface PriceList {
    planName: string;
    price: string;
}
export interface PaymentList {
    methodCode: string;
    methodName: string;
}

export interface chatList {
    userNumber: string;
    channelId: string;
    operationType: PriceList[];
    userName: string;
    sendmessage: string;
    sessionId: string;
}
