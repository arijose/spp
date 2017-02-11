/********************************
 * create-user.component
 * Package and class imports
 *******************************/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/share';

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

import { IUser, IRoom, IUserRoom } from '../../interfaces/index';
import { User, UserRoom } from '../../classes/index';

/********************************
 * Component declaration
 *******************************/
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.less']
})
export class CreateUserComponent implements OnInit {
  private roomId: string;

  public user: IUser = new User();

  constructor(private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef) { }

  ngOnInit() {
    this.roomId = this.activatedRoute.snapshot.params['id'];
  }

  public createUser(): void {

    if (this.user.name && this.roomId) {
      this.user.roomId = this.roomId;
      this.user.avatar = '';
      this.user.isOwner = false;

      this.socketService.createUser(this.user).subscribe(data => {

        // Navigate to room
        let navigationExtras: NavigationExtras = {
          queryParams: { '': data.room.id },
        };

        // Update this user's model
        let user = {
          id: data.user.id,
          name: data.user.name,
          avatar: '',
          roomId: data.user.roomId,
          isOwner: data.user.isOwner
        }

        this.userService.setUser(user);

        // Set user data
        localStorage.setItem('poker-user', JSON.stringify(user));

        this.router.navigate(['/room', data.room.id]);
      });
    }

  }

  private logError(error: Object): void {
    console.dir(error);
  }
}
