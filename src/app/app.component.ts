import { Router, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import { AppHeaderComponent } from './components/app-header/app-header.component';

declare let ga: any;

@Component({
  selector: 'app-root',
  template: `
    <app-app-header></app-app-header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}
