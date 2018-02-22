// Request & Reponse Interface Of Every API

export interface ChangeLanguage {
    callPlan: string;
    imei: string;                // Can Be string / number
    language: string;
    msisdn: number;
    secretKey: string;
    subscriberType: string
}
export interface ProfileRequest {
    callPlan: string;
    deviceManufacture: string;
    deviceModel: string;
    deviceOs: string;
    imei: string;                // Can Be string / number
    language: string;
    msisdn: number;
    secretKey: string;
    subscriberType: string
}
