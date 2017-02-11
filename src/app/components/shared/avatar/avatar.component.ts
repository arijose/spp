import { Component, OnInit } from '@angular/core';


import { IUser } from '../../../interfaces/index';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.less']
})
export class AvatarComponent implements OnInit {
  private user: IUser;

  public src: string;

  constructor() { }

  ngOnInit(): void {
    this.user = <IUser>JSON.parse(localStorage.getItem('poker-user'));

    if (this.user && this.user.avatar) {
      this.src = this.user.avatar;
    }
  }

  onAvatarSelected(event: any): void {
    this.src = event;

    // this.user.avatar = event;

    // // Set local storage
    // localStorage.setItem('poker-user', JSON.stringify(this.user));
  }
}