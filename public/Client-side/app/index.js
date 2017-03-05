import {BrowserModule} from '@angular/platform-browser';
import {UIView, UIRouterModule, provideUIRouter} from 'ui-router-ng2';
import {STATES, MyUIRouterConfig} from './routes';

import {HelloComponent} from './hello';

@UIRouterModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    HelloComponent
  ],
  providers: [
    provideUIRouter({configClass: MyUIRouterConfig})
  ],
  states: STATES,
  bootstrap: [UIView]
})
export class AppModule {}
