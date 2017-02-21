
/********************************
 * emote.component
 * Package and class imports
 *******************************/

import { Component, OnInit } from '@angular/core';

/********************************
 * Components
 *******************************/

/********************************
 * Services
 *******************************/

import { SocketService, UserService } from '../../services/index';

/********************************
 * Classes, interfaces
 *******************************/

import { IUser } from '../../interfaces/index';

/********************************
 * Third party
 *******************************/

/********************************
 * Component declaration
 *******************************/

@Component({
  selector: 'app-emote',
  templateUrl: './emote.component.html',
  styleUrls: ['./emote.component.less']
})
export class EmoteComponent implements OnInit {

  constructor(private socketService: SocketService, private userService: UserService) { }

  ngOnInit() { }

  onEmojiSelected(event: any): void {
    let user: IUser = this.userService.getUser();

    user.emoji = event.target.classList[1]

    this.socketService.updateEmoji(user);
  }

  onClearEmoji(): void {
    let user: IUser = this.userService.getUser();

    user.emoji = '';

    this.socketService.updateEmoji(user);
  }
}
