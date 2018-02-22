import { config } from '../_config/config';
export interface ILogger {
    group(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    assert(...args: any[]): void;
    error(...args: any[]): void;
    table(...args: any[]): void;
}
declare var console: any;

export class Logger implements ILogger {
    private _trig: boolean;
    private _msg = 'Console Logs are Blocked';

    constructor() {
        // Read the Config and Set trigger .
        this._trig = config.logs;
    }

    public log(...args: any[]): void {
        if (this._trig) {
            // tslint:disable-next-line:no-unused-expression
            (console && console.log) && console.log(...args);
        } else {
            this.consoleBlocker();
        }
    }

    public warn(...args: any[]): void {
        if (this._trig) {
            // tslint:disable-next-line:no-unused-expression
            (console && console.warn) && console.warn(...args);
        } else {
            this.consoleBlocker();
        }
    }

    public assert(...args: any[]): void {
        if (this._trig) {
            // tslint:disable-next-line:no-unused-expression
            (console && console.assert) && console.assert(...args);
        } else {
            this.consoleBlocker();
        }
    }

    public error(...args: any[]): void {
        if (this._trig) {
            // tslint:disable-next-line:no-unused-expression
            (console && console.error) && console.error(...args);
        } else {
            this.consoleBlocker();
        }
    }

    public table(...args: any[]): void {
        if (this._trig) {
            // tslint:disable-next-line:no-unused-expression
            (console && console.table) && console.table(...args);
        } else {
            this.consoleBlocker();
        }

    }

    public group(...args: any[]): void {
        if (this._trig) {
            // tslint:disable-next-line:no-unused-expression
            (console && console.group) && console.group(...args);
        } else {
            this.consoleBlocker();
        }
    }

    private consoleBlocker() {
        
    }
}

