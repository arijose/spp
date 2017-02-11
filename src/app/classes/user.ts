/********************************
 * user.class
 * Package and class imports
 *******************************/

import { IUser, IRoom } from '../interfaces/index';

export class User implements IUser {
    public id: string = '';
    public name: string = '';
    public avatar: string = '';
    public roomId: string = '';
    public isOwner: boolean = false;
    public points: string = null;
    public reveal: boolean = false;
    public hasNewPoints: boolean = true;
    public isPlayer: boolean = true;
}