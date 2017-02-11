/********************************
 * timer.class
 * Package and class imports
 *******************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/********************************
 * Services
 *******************************/

import { EventService } from './event.service';

/********************************
 * Classes, interfaces
 *******************************/

/********************************
 * Class declaration
 *******************************/

@Injectable()
export class TimerService {
    private timeout: any;
    private totalSeconds: number = 0;
    private timerPaused: boolean = false;

    constructor(private eventService: EventService) { }

    setTime(time: number): void {
        this.totalSeconds = time;
    }

    startTimer(): void {
        this.timerPaused = false;

        this.stopTimer();

        this.elapseTime();
    }

    stopTimer(): void {
        this.totalSeconds = 0;

        clearTimeout(this.timeout);

        this.timeout = null;
    }

    pauseTimer(): void {
        this.timerPaused = true;

        clearTimeout(this.timeout);

        this.timeout = null;
    }

    unpauseTimer(): void {
        this.timerPaused = false;

        this.elapseTime();
    }

    private elapseTime(): void {
        let hours = Math.floor(this.totalSeconds / 3600);
        let minutes = Math.floor((this.totalSeconds - (hours * 3600)) / 60);
        let seconds = this.totalSeconds - ((hours * 3600) + (minutes * 60));

        // Format time to display digitally
        hours = this.formatTime(hours);
        minutes = this.formatTime(minutes);
        seconds = this.formatTime(seconds);

        // Recurse timer
        this.timeout = setTimeout(() => {
            // Only increment timer if not paused
            this.elapseTime();
        }, 1000);

        let time: string = hours + ':' + minutes + ':' + seconds;

        this.eventService.updateTimer(time);

        ++this.totalSeconds;
    }

    private formatTime(time: any): any {
        if (time < 10) {
            time = '0' + time;
        }

        return time;
    }
}