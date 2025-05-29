import { Routes } from '@angular/router';
import { AuthErrorPage, AuthCallbackPage, NotFoundPage, ForbiddenPage } from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { ByuLayout } from './layouts/byu/byu.layout';

export const routes: Routes = [
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-callback', component: AuthCallbackPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '', component: ByuLayout, children: [ {path: '', component: HomePage} ],}, 
  { path: '**', component: NotFoundPage },
];
