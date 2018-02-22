// Request & Reponse Interface Of Every API
export interface common {
    callPlan: string;
    deviceManufacture: string;
    deviceModel: string;
    deviceOs: string;
    imei: string;
    language: string;
    msisdn: string;
    secretKey: string;
}

export interface LoginInterface extends common {
    imsi: string;
    otp: string;                // Can Be string / number
}

export interface AutoLoginInterface{
    callPlan: string;
    deviceManufacture: string;
    deviceModel: string;
    deviceOs: string;
    imei: string;
    language: string;
    secretKey: string;
    imsi: string;
    otp: string; 
}

export interface LoginResponse {
    message: string;
    status: boolean;
}

export interface OTPGenerateRequest { }
export interface OTPGenerateResponse { }

export interface RecomendedRequest extends common {
    page: number;
    subscriberType: string;
}
export interface RecomendedReponse { }

export interface ProfileRequest extends common {
    subscriberType: string;
}
export interface ProfileResponse {
    profileTime: number,
    statusSubscription: boolean,
    dueDateHybrid: string,
    subscriberType: string,
    emailHybrid: string,
    dueDate: string,
    packageList: [
        {
            isRenewable: boolean,
            isProductBuy: boolean,
            isMore: boolean,
            isShareQuota: boolean,
            name: string,
            linkProductBuyType: string,
            linkProductBuyValue: string,
            productId: string,
            detail: [
                {
                    validity: string,
                    value: string
                }
            ]
        }
    ],
    callPlan: string,
    balance: string,
    creditLimit: string,
    validity: string,
    msisdn: string,
    profileColor: string,
    balanceTrims: string,
    creditLimitHybrid: string,
    email: string,
    status: boolean
}
export interface NotificationRequest extends common {
    lastId: number
}

export interface LogoutRequest extends common {
    imsi: string;
    otp: string;
    secretKey: string;
}
export interface LogoutResponse { }

export interface ChangeLanguage {
    callPlan: string;
    imei: string;                // Can Be string / number
    language: string;
    msisdn: string;
    secretKey: string;
    subscriberType: string
}
export interface ChangeEmail extends common {
    email: string
}
export interface ReloadVoucher extends common {
    voucherNumber: string
}
export interface EmailInvoice extends common {
    email: string;
    invoiceDate: string
}
export interface RemainCredit extends common {
    invoicenumber: string;
    accountnumber: string
}
export interface Search extends common {
    keyword: string;
    page: number;
    subscriberType: string;
}
export interface ProductDetail extends common {
    productId: string;
    subscriberType: string;
}
export interface ReadNotification extends common {
    id: number;
}
export interface GetInfo extends common {
    accountnumber: string;
    amount: string;
    paymentMethod: String;
    subscriberType: String;
}
export interface child extends common {
    isAction: number;
    msisdnChild: string;
    productId: string;
}
export interface RecomendedAllRequest extends common {
    page: Number;
    subscriberType: string;
}
export interface BannerAllRequest extends common {
    page: Number;
    subscriberType: string;
}
