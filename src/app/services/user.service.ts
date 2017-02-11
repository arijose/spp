/********************************
 * user.service
 * Package and class imports
 *******************************/
import { Injectable } from '@angular/core';

/********************************
 * Services
 *******************************/

/********************************
 * Classes, interfaces
 *******************************/

import { IUser } from '../interfaces/index';

/********************************
 * Class declaration
 *******************************/

@Injectable()
export class UserService {
  private user: IUser;

  constructor() { }

  setUser(user: IUser): void {
    this.user = user;
  }

  getUser(): IUser {
    return this.user;
  }

  deleteUser(): void {
    this.user = null;
  }
}
