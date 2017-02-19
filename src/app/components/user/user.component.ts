/********************************
* user.component
* Package and class imports
*******************************/

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/********************************
 * App Components
 *******************************/

/********************************
 * Classes, interfaces, directives, pipes
 *******************************/

import { IUser, IRoom } from '../../interfaces/index';

/********************************
 * Services
 *******************************/

/********************************
 * Third-party
 *******************************/

/********************************
 * Declaration
 *******************************/


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  @Input() user: IUser;
  @Input() room: IRoom;
  @Input() canKick: boolean = false;

  @Output() kickedUser: EventEmitter<IUser> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onKickUser(user: IUser): void {
    this.kickedUser.emit(user);
  }
}
