import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorage {
    public defaultValue = '';

    constructor() { }

    public store(key: string, val: any): void {
        sessionStorage.setItem(key, val);
    }

    public retrive(key: string): any {
        return sessionStorage.getItem(key) || this.defaultValue;
    }

    public remove(key: string): void {
        sessionStorage.removeItem(key);
    }

    public clearSession(): void {
        sessionStorage.clear();
    }
}
