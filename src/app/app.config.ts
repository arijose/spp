/********************************
 * app.config
 * Package and class imports
 *******************************/

import { Injectable } from '@angular/core';
import { AppConstants } from './app.constants';

/********************************
 * Class declaration
 *******************************/

@Injectable()
export class AppConfiguration {
    public endpoints: any = {
        HOME: AppConstants.SERVER_ENDPOINT,
        IMAGE: 'app/images/'
    }
}

