import { Injectable } from "@angular/core";
/**
 *  Import GoogleAnalyticsEventService 
 *  this.ga.emitEvent('Favorit Page', 'Item Click', '');
 *  Parameters
 *  1 -> Category Name
 *  2 -> Action like Click , Added to Cart , Payment navigation
 *  3 -> Data like url or Item Id 
 *  4 -> Additional Value (optional)
 */
declare let ga: any;

@Injectable()
export class GoogleAnalyticsEventsService {

    public emitEvent(eventCategory: string, eventAction: string, eventLabel: string = null, eventValue: number = null) {
        ga('send', 'event', {
            eventCategory: eventCategory,
            eventLabel: eventLabel,
            eventAction: eventAction,
            eventValue: eventValue
        });
    }
}