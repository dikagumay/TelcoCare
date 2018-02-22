import { enableProdMode, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// import { LoginComponent } from './app/components/login/login.component';
import { environment } from './environments/environment';
//  import { environment } from './environments/environment.prod';

// if (environment.production) {
//   enableProdMode();
// }

if (!isDevMode()){
  enableProdMode();
  }

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));     
