/********************************
 * user-room.class
 * Package and class imports
 *******************************/

import { IUser, IRoom, IUserRoom } from '../interfaces/index';
import { User, Room } from './index';

export class UserRoom implements IUserRoom {
    public user: IUser = new User();
    public room: IRoom = new Room();
}