/********************************
 * user.interface
 * Package and class imports
 *******************************/

export interface IUser {
    id?: string;
    name?: string;
    avatar?: string;
    roomId?: string;
    isOwner?: boolean;
    points?: string;
    hasNewPoints?: boolean;
    isPlayer?: boolean;
    emoji?: string;
}