/********************************
 * socket.service
 * Package and class imports
 *******************************/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

/********************************
 * Services
 *******************************/

import { AppConfiguration } from '../app.config';

/********************************
 * Classes, interfaces
 *******************************/

import { IUser, IRoom, IUserRoom, IUserRoomIds, ILock, IFreeze } from '../interfaces/index';

/********************************
 * Third Party
 *******************************/

import * as io from "socket.io-client";

/********************************
 * Class declaration
 *******************************/

@Injectable()
export class SocketService {
  private url = 'http://localhost:3000';
  private socket: any;
  private connection;

  constructor(private http: Http, private config: AppConfiguration) {
    this.socket = io.connect(this.url);

    this.socket.on('connection', () => { });
  }

  setSocket(socket: any): void {
    this.socket = socket;
  }

  createRoom(userRoom: IUserRoom): Observable<any> {
    let url: string = this.config.endpoints.HOME + '/createRoom';
    let headers: Headers = new Headers(
      { 'Content-Type': 'application/json' }
    );

    // Return create room response
    return this.http.post(url, JSON.stringify(userRoom), { headers: headers })
      .map(res => res.json());
  }

  createUser(user: IUser): Observable<any> {
    let url: string = this.config.endpoints.HOME + '/createUser';
    let headers: Headers = new Headers(
      { 'Content-Type': 'application/json' }
    );

    // Return create user response
    return this.http.post(url, JSON.stringify(user), { headers: headers })
      .map(res => res.json());
  }

  removeUser(user: IUser): void {
    this.socket.emit('remove-user', user);
  }

  editName(room: IRoom): void {
    this.socket.emit('edit-name', room);
  }

  kickUser(user: IUser): void {
    this.socket.emit('kick-user', user);
  }

  setPoints(user: IUser): void {
    this.socket.emit('set-points', user);
  }

  revealPoints(room: IRoom): void {
    this.socket.emit('reveal-points', room);
  }

  resetPoints(room: IRoom): void {
    this.socket.emit('reset-points', room);
  }

  joinRoom(roomId: string): void {
    this.socket.emit('join-room', roomId);
  }

  getRoom(id: string): void {
    this.socket.emit('get-room', id);
  }

  addUser(userRoom: IUserRoom): void {
    this.socket.emit('add-user', userRoom);
  }

  getUser(userRoom: IUserRoomIds): void {
    this.socket.emit('get-user', userRoom);
  }

  lockRoom(id: string, locked: boolean): void {
    let lock: ILock = {
      id: id,
      isLocked: locked
    }

    this.socket.emit('lock-room', lock);
  }

  freezeRoom(id: string, frozen: boolean): void {
    let freeze: IFreeze = {
      id: id,
      isFrozen: frozen
    }

    this.socket.emit('freeze-room', freeze);
  }

  updatePlayer(user: IUser): void {
    this.socket.emit('update-player', user)
  }

  updateStartTimer(room: IRoom): void {
    this.socket.emit('start-timer', room);
  }

  updateStopTimer(room: IRoom): void {
    this.socket.emit('stop-timer', room);
  }

  updatePauseTimer(room: IRoom): void {
    this.socket.emit('pause-timer', room);
  }

  updateUnpauseTimer(room: IRoom): void {
    this.socket.emit('unpause-timer', room);
  }

  updateEmoji(user: IUser): void {
    this.socket.emit('emoji-updated', user);
  }

  updateStory(room: IRoom): void {
    this.socket.emit('story-updated', room);
  }

  emojiUpdated(): Observable<IUser> {
    return new Observable(observer => {
      return this.socket.on('update-emoji', (user) => {
        observer.next(user);
      });
    })
  }

  storyUpdated(): Observable<string> {
    return new Observable(observer => {
      return this.socket.on('update-story', (story) => {
        observer.next(story);
      });
    })
  }

  pauseTimer(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('update-pause-timer', () => {
        observer.next();
      });
    })
  }

  unpauseTimer(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('update-unpause-timer', () => {
        observer.next();
      });
    })
  }

  startTimer(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('update-start-timer', () => {
        observer.next();
      });
    })
  }

  stopTimer(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('update-stop-timer', () => {
        observer.next();
      });
    })
  }

  updatePoints(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('update-points', (user) => {
        observer.next(user);
      });
    })
  }

  roomJoined(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('room-joined', (room) => {
        observer.next(room);
      });
    });
  }

  updateRoom(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('update-room', (room) => {
        observer.next(room);
      });
    });
  }

  kickedUser(): Observable<any> {
    return new Observable(observer => {
      return this.socket.on('kicked-user', (user) => {
        observer.next(user);
      });
    });
  }
}
