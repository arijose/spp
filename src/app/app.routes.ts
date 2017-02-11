/********************************
 * app.routes
 * Package and class imports
 *******************************/

import { Routes, RouterModule } from '@angular/router';

/********************************
 * app.routes
 * Package and class imports
 *******************************/

import { CreateRoomComponent } from './components/create-room/create-room.component';
import { RoomComponent } from './components/room/room.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

const baseRoutes: Routes = [
    { path: '', component: CreateRoomComponent },
    { path: 'room/:id', component: RoomComponent },
    { path: 'user/:id', component: CreateUserComponent }
];


// Configure routes to be bootstrapped
export const appRoutes: Routes = [
    ...baseRoutes
];

export const AppRoutes = RouterModule.forRoot(appRoutes, {
    useHash: true
});