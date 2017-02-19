import { Component, OnInit, Input, Output } from '@angular/core';

import { IUser, IRoom } from '../../interfaces/index';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  @Input() user: IUser;
  @Input() room: IRoom;

  constructor() { }

  ngOnInit() { }

}
