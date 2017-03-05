import {Injectable} from '@angular/core';
import {UIRouter} from 'ui-router-ng2';

import {HelloComponent} from './hello';

export const STATES = [
  {
    name: 'App',
    url: '/',
    component: HelloComponent
  }
];

@Injectable()
export class MyUIRouterConfig {
  configure(uiRouter: UIRouter) {
    uiRouter.urlRouterProvider.otherwise(() => uiRouter.stateService.go('App'));
  }
}
