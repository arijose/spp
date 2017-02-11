/********************************
 * user-room.interface
 * Package and class imports
 *******************************/

import { IUser, IRoom } from './index';

export interface IUserRoom {
    user: IUser;
    room: IRoom;
}