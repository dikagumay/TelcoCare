import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'app/_strings/translate/translate.service';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
	name: 'translate',
	pure: false // impure pipe, update value when we change language
})

export class TranslatePipe implements PipeTransform {

	constructor(private _translate: TranslateService) { }

	transform(value: string,  languageString: string): any {
		const lang = parseFloat(languageString);
		if (!value) { return; }
		return this._translate.instant(value, lang);
	}
}

