import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

import {
  provideHttpClient,
  withFetch
} from '@angular/common/http';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';


import { routes } from './app.routes';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
	provideHttpClient(withFetch()),
   provideZonelessChangeDetection()
	// provideClientHydration(withEventReplay())
  ]
};
