import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppInitializerService } from './services/app-initializer.service';

// Factory function that returns the initializer function
export function initializeAppFactory(appInitService: AppInitializerService) {
  return () => appInitService.initializeApp();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppInitializerService],
      multi: true
    }
  ]
};
