/********************************
 * room.class
 * Package and class imports
 *******************************/

import { IUser, IRoom } from '../interfaces/index';

export class Room implements IRoom {
    public id: string = '';
    public name: string = '';
    public users: Array<IUser> = [];
    public ownerId: string = '';
    public isLocked: boolean = false;
    public isFrozen: boolean = false;
    public time: number = 0;
}