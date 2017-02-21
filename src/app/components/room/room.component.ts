/********************************
 * room.component
 * Package and class imports
 *******************************/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Popover } from "ng2-popover";
import 'rxjs/add/operator/share';


/********************************
 * Components
 *******************************/

/********************************
 * Services
 *******************************/

import { SocketService, UserService, EventService, TimerService } from '../../services/index';

/********************************
 * Classes, interfaces
 *******************************/

import { IUser, IRoom, IUserRoom, IFibonnaci } from '../../interfaces/index';

/********************************
 * Third party
 *******************************/

import * as io from "socket.io-client";
import * as _ from 'lodash';

/********************************
 * Component declaration
 *******************************/

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {
  private updateRoomSubscription: Subscription;
  private kickedUserSusbscription: Subscription;
  private updatePointsSubscription: Subscription;
  private startTimerSubscription: Subscription;
  private stopTimerSubscription: Subscription;
  private pauseTimerSubscription: Subscription;
  private unpauseTimerSubscription: Subscription;
  private timerSubscription: Subscription;
  private updateEmojiSubscription: Subscription;

  private url = 'http://localhost:3000';
  private socket: any;
  private timerActivated: boolean = false;
  private emojiTimeout: any = null;

  public roomId: string;
  public userId: string;
  public ownerName: string;
  public isEditingName: boolean = false;
  public reveal: boolean = false;
  public time: string = '00:00:00';

  public user: IUser;
  public users: Array<IUser> = [];
  public owner: IUser;
  public room: IRoom;
  public lockRoom: boolean;
  public canKick: boolean;
  public freezeRoom: boolean;
  public fibonacci: Array<IFibonnaci> = [
    { points: '0' },
    { points: '1' },
    { points: '2' },
    { points: '3' },
    { points: '5' },
    { points: '8' },
    { points: '13' },
    { points: '21' },
    { points: '34' },
    { points: '55' },
    { points: '89' },
    { points: '?' }
  ];

  constructor(private socketService: SocketService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private timerService: TimerService) {

  }

  ngOnInit() {
    this.updateRoomSubscription = this.socketService.updateRoom().subscribe(res => this.updateRoom(res));
    this.kickedUserSusbscription = this.socketService.kickedUser().subscribe(res => this.kickedUser(res));
    this.updatePointsSubscription = this.socketService.updatePoints().subscribe(res => this.updatePoints(res));
    this.startTimerSubscription = this.socketService.startTimer().subscribe(() => this.onStartTimer());
    this.stopTimerSubscription = this.socketService.stopTimer().subscribe(() => this.onStopTimer());
    this.pauseTimerSubscription = this.socketService.pauseTimer().subscribe(() => this.onPauseTimer());
    this.unpauseTimerSubscription = this.socketService.unpauseTimer().subscribe(() => this.onUnpauseTimer());
    this.updateEmojiSubscription = this.socketService.emojiUpdated().subscribe((res) => this.updateEmoji(res));

    this.timerSubscription = this.eventService.timerObserverable.subscribe(time => this.updateTime(time));

    this.roomId = this.activatedRoute.snapshot.params['id'];

    if (this.roomId) {
      this.setupUserRoom(this.roomId);
    } else {
      // Redirect to create room
      this.router.navigate(['/']);
    }

  }

  ngOnDestroy() {
    this.updateRoomSubscription.unsubscribe();
    this.kickedUserSusbscription.unsubscribe();
    this.updatePointsSubscription.unsubscribe();
    this.startTimerSubscription.unsubscribe();
    this.stopTimerSubscription.unsubscribe();
    this.pauseTimerSubscription.unsubscribe();
    this.unpauseTimerSubscription.unsubscribe();
    this.updateEmojiSubscription.unsubscribe();
  }

  onStartTimer(): void {
    // Start timer on reset
    this.timerService.startTimer();

    this.timerActivated = true;
  }

  onStopTimer(): void {
    this.timerService.startTimer();
  }

  onPauseTimer(): void {
    this.timerService.pauseTimer();
  }

  onUnpauseTimer(): void {
    this.timerService.unpauseTimer();
  }

  onUpdatePlayer(): void {
    this.user.isPlayer = !this.user.isPlayer;

    this.socketService.updatePlayer(this.user);
  }

  onResetRoom(): void {
    this.socketService.updateStartTimer(this.room);

    this.socketService.resetPoints(this.room);
  }

  onSelectedFibonacci(card: IFibonnaci): void {
    this.user.points = card.points;

    // Set selected card style
    _.each(this.fibonacci, (card) => {
      card.selected = false;
    })

    card.selected = true;

    // Set points if user is in player mode
    if (this.user.isPlayer) {
      this.socketService.setPoints(this.user);
    }
  }

  onLockRoom(): void {
    this.lockRoom = !this.lockRoom;

    // Lock room
    this.socketService.lockRoom(this.roomId, this.lockRoom);
  }

  onFreezeRoom(): void {
    this.freezeRoom = !this.freezeRoom;

    // Freeze room
    this.socketService.freezeRoom(this.roomId, this.freezeRoom)

    // Pause or unpause timer
    if (this.freezeRoom) {
      this.socketService.updatePauseTimer(this.room);
    } else {
      this.socketService.updateUnpauseTimer(this.room);
    }
  }

  onEditName(): void {
    this.isEditingName = !this.isEditingName;
  }

  onEditedName(event: any): void {
    this.room.name = event.currentTarget.value;

    this.socketService.editName(this.room);

    this.isEditingName = false;
  }

  onRevealRoom(): void {
    this.room.reveal = !this.room.reveal;

    this.socketService.revealPoints(this.room);
  }

  onSignout(): void {
    this.socketService.kickUser(this.user);
  }

  onKickedUser(user: IUser): void {
    if (user.id !== this.userId) {
      this.socketService.kickUser(user);
    }
  }

  private updateEmoji(res: any): void {
    // Reset timeout since this is an emoji update
    clearTimeout(this.emojiTimeout);

    this.emojiTimeout = null;

    // Find emoji user
    const user: IUser = _.filter(this.room.users, (roomUser) => {
      return roomUser.id === res.user.id;
    })[0];

    user.emoji = '';
    user.hasNewEmoji = false;

    user.emoji = res.user.emoji;

    user.hasNewEmoji = user.emoji !== '' ? true : false;

    // Set emoji timeout for animation and clean up
    this.emojiTimeout = setTimeout(() => {
      clearTimeout(this.emojiTimeout);

      this.emojiTimeout = null;

      user.hasNewEmoji = false;
      user.emoji = '';
    }, 10000);
  }

  private updateTime(time: string): void {
    this.time = time;
  }

  private setupUserRoom(roomId: string): void {
    this.socket = io.connect(this.url);
    // Set user data
    const user: IUser = JSON.parse(localStorage.getItem('poker-user'));

    // If room ids match, and there is a user object
    if (user && (user.roomId === this.roomId)) {
      this.user = user;
      this.userId = user.id;

      this.userService.setUser(user);

      this.socket = io.connect(this.url);

      // Go to room when user has joined
      this.socketService.roomJoined().subscribe(() => {
        this.socketService.getRoom(this.roomId);
      });

      // Join room with roomId
      this.socketService.joinRoom(user.roomId);

    } else {
      // Remove storage
      localStorage.removeItem('poker-user');

      // Setup user
      this.router.navigate(['/user', this.roomId]);
    }
  }

  private updatePoints(res: any): void {
    let user: IUser = <IUser>res.user;

    if (user) {
      _.filter(this.room.users, (roomUser) => {
        if (roomUser.id === user.id) {
          roomUser.points = user.points;

          let newPointsUser: IUser = roomUser;

          if (newPointsUser.isOwner) {
            this.owner = newPointsUser;
          }

          newPointsUser.hasNewPoints = true;

          // Reset hasNewPoints to reset animation
          setTimeout(() => {
            newPointsUser.hasNewPoints = false;
          }, 1100);
        }
      })[0];
    }
  }

  private kickedUser(res: any): void {
    let user: IUser = <IUser>res.user;

    if (user.id === this.userId) {
      localStorage.removeItem('poker-user');

      // Redirect to create room
      this.router.navigate(['/']);
    }
  }

  private updateRoomSettings(room: IRoom): void {
    this.lockRoom = room.isLocked;
    this.freezeRoom = room.isFrozen;
    this.reveal = room.reveal;

    this.canKick = room.ownerId === this.user.id;
  }

  private updateRoom(res: any): void {
    // Only update if a room is available

    if (res.room) {

      this.room = <IRoom>res.room;

      this.updateRoomSettings(this.room);

      let roomUser = _.filter(this.room.users, (user) => {
        return user.id === this.user.id;
      })[0];


      this.users = _.filter(this.room.users, (user) => {
        return !user.isOwner;
      })

      this.owner = _.filter(this.room.users, (user) => {
        return user.isOwner;
      })[0];

      if (!roomUser) {
        // User probably refreshed, so re-add to room
        let userRoom: IUserRoom = {
          room: this.room,
          user: this.user
        }

        this.socketService.addUser(userRoom);
      }
    } else {
      // Redirect to create room
      this.router.navigate(['/']);
    }
  }

  private logError(error: Object): void {
    console.dir(error);
  }
}
