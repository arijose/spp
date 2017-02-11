/********************************
 * app.module
 * Angular Imports
 *******************************/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routes';

/********************************
 * App Components
 *******************************/

import { AppComponent } from './app.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { RoomComponent } from './components/room/room.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AvatarComponent } from './components/shared/avatar/avatar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EmoteComponent } from './components/emote/emote.component';

/********************************
 * Directives
 *******************************/

import { DroppableDirective } from './directives/droppable.directive';

/********************************
 * Services
 *******************************/

import { AppConfiguration } from './app.config';
import { AppConstants } from './app.constants';
import { SocketService } from './services/socket.service';
import { UserService } from './services/user.service';
import { EventService } from './services/event.service';
import { TimerService } from './services/timer.service';


/********************************
 * Third-party Components
 *******************************/

/********************************
 * Module declaration
 *******************************/

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    // Components
    AppComponent,
    CreateRoomComponent,
    CreateUserComponent,
    RoomComponent,
    AvatarComponent,
    FooterComponent,

    // Directives
    DroppableDirective,

    EmoteComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule,

    // Routing config
    AppRoutes

    // Third-party

  ],

  providers: [
    AppConfiguration,
    AppConstants,
    SocketService,
    UserService,
    EventService,
    TimerService
  ]
})

/********************************
 * Module declaration
 *******************************/

export class AppModule { }