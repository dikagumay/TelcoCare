import { HttpParams } from '@angular/common/http';

export function isUndefined(inName: any): boolean {
    return inName === undefined;
}

export function isEmpty(inName: any): boolean {
    return inName === '';
}

export function isEmptyArray(arr: Array<any>): boolean {
    return !(_size(arr) > 0);
}

export function _size(obj): number {
    let size = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

export function _contains(key, data): boolean {
    return data.indexOf(key) >= 0;
}

export function GenHttpParams(data: object, httpParams = new HttpParams()): Object {
    Object.keys(data)
        .filter(key => {
            const v = data[key];
            return (Array.isArray(v) || typeof v === 'string') ?
                (v.length > 0) : (v !== null && v !== undefined);
        }).forEach(key => {
            httpParams = httpParams.set(key, data[key]);
        });
    return { params: httpParams };
}

export function _numberOnly(event: any){
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
}