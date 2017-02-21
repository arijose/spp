/********************************
 * create-room.component
 * Package and class imports
 *******************************/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/share';

/********************************
 * Components
 *******************************/

/********************************
 * Services
 *******************************/

import { SocketService, UserService, TimerService } from '../../services/index';

/********************************
 * Classes, interfaces
 *******************************/

import { IUser, IRoom, IUserRoom } from '../../interfaces/index';
import { UserRoom } from '../../classes/index';

/********************************
 * Third party
 *******************************/



/********************************
 * Component declaration
 *******************************/

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.less']
})
export class CreateRoomComponent implements OnInit {
  public userRoom: IUserRoom = new UserRoom();

  @ViewChild('avatar') avatar: ViewChild;

  constructor(private socketService: SocketService,
    private router: Router,
    private userService: UserService,
    private timerService: TimerService,
    private elementRef: ElementRef) { }

  ngOnInit() {
    // Go to room when user has joined
    this.socketService.roomJoined().subscribe(() => {
      let user: IUser = this.userService.getUser();

      this.router.navigate(['/room', user.roomId]);
    });
  }

  /**
* @function createRoom
* @description Creates a room based on the create room form
* @returns {void} 
*/

  public createRoom(): void {
    // Clear any local variables to prevent re-entering a room exited from
    localStorage.removeItem('poker-user');

    this.timerService.setTime(0);
    this.timerService.pauseTimer();
    this.userService.deleteUser();

    if (this.userRoom.user.name && this.userRoom.room.name) {
      this.userRoom.user.avatar = '';
      this.userRoom.user.isOwner = true;

      this.socketService.createRoom(this.userRoom).subscribe(data => {
        // Navigate to room
        let navigationExtras: NavigationExtras = {
          queryParams: { '': data.room.id },
        };

        // Update this user's model
        let user = {
          id: data.user.id,
          name: data.user.name,
          avatar: '',//this.elementRef.nativeElement.querySelector('avatar img').src || '',
          roomId: data.user.roomId,
          isOwner: data.user.isOwner
        }

        this.userService.setUser(user);

        // Set user data
        localStorage.setItem('poker-user', JSON.stringify(user));

        this.router.navigate(['/room', user.roomId]);

      });
    }

  }

  private logError(error: Object): void {
    console.dir(error);
  }
}
