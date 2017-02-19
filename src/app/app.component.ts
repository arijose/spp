/********************************
 * app.component
 * Package and class imports
 *******************************/

import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/********************************
 * Component imports
 *******************************/

import { IUser } from './interfaces/index';

/********************************
 * Service imports
 *******************************/

import { AppConfiguration } from './app.config';
import { SocketService, UserService, EventService } from './services/index';

/********************************
 * Provider imports
 *******************************/

/********************************
 * Component declaration
 *******************************/

@Component({
  selector: 'app-root',
  providers: [AppConfiguration],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

/********************************
 * Class declaration
 *******************************/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  private frostSubscription: Subscription;

  public showFrost: boolean = false;

  constructor(private config: AppConfiguration,
    private socketService: SocketService,
    private userService: UserService,
    private eventService: EventService) { }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event) {
    const user: IUser = this.userService.getUser();

    if (user && user.id) {
      // this.socketService.removeUser(this.userService.getUser());
    }
  }

  @HostListener('window:drop', ['$event']) onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:dragover', ['$event']) onDrag(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
