import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({
      "projectId":"danotes-87c02",
      "appId":"1:801859339504:web:183b4295bb281e54b7ee35",
      "storageBucket":"danotes-87c02.firebasestorage.app",
      "apiKey":"AIzaSyA9Ypb04TfhslxYqGX7JhqO6a4RfJjsYG4",
      "authDomain":"danotes-87c02.firebaseapp.com",
      "messagingSenderId":"801859339504"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
