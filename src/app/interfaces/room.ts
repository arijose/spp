/********************************
 * room.interface
 * Package and class imports
 *******************************/

import { IUser } from './index';

export interface IRoom {
    id?: string;
    name?: string;
    users?: Array<IUser>;
    ownerId?: string;
    isLocked?: boolean;
    isFrozen?: boolean;
    reveal?: boolean;
    time?: number;
}