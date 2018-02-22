import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from './translations'; // import our opaque token

@Injectable()
export class TranslateService {
	private _currentLang: string;

	public get currentLang() {
	  return this._currentLang;
	}

  // inject our translations
	constructor(@Inject(TRANSLATIONS) private _translations: any) {
	}

	public use(lang: string): void {
		// set current language
		this._currentLang = lang;
	}

	private translate(key: string, lang: number): string {
		// private perform translation
		const translation = key;
		let languageTo;
		if (lang === 1) {
			languageTo = 'en';
		} else {
			languageTo = 'es';
		}
		return this._translations[languageTo][key];
    // if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
		// 	return this._translations[this.currentLang][key];
		// }

		// return translation;
	}

	public instant(key: string, lang: number) {
		// public perform translation
		return this.translate(key, lang);
	}
}
