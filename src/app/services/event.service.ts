/********************************
 * event.service
 * Package and vendor class imports
 * Event manager
 *******************************/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';

/********************************
 * Services
 *******************************/

/********************************
 * Classes, interfaces
 *******************************/

/********************************
 * Class declaration
 *******************************/
@Injectable()
export class EventService {
    private frostObserver: Observer<boolean>;
    private timerObserver: Observer<string>;

    public frostObservable: Observable<boolean>;
    public timerObserverable: Observable<string>;

    constructor() {
        this.frostObservable = new Observable<boolean>(observer => this.frostObserver = observer).share();
        this.timerObserverable = new Observable<string>(observer => this.timerObserver = observer).share();
    }

    public updateFrost(update: boolean): void {
        this.frostObserver.next(update);
    }

    public updateTimer(update: string): void {
        this.timerObserver.next(update);
    }
}