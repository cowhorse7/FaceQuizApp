import { Routes } from '@angular/router';
import { AuthErrorPage, AuthCallbackPage, NotFoundPage, ForbiddenPage, authGuard } from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { ByuLayout } from './layouts/byu/byu.layout';
import { DecksPage } from './pages/decks/decks.page';
import { DeckCardsPage } from './pages/deck-cards/deck-cards.page';

export const routes: Routes = [
  { path: 'forbidden', component: ForbiddenPage },
  { path: 'auth-callback', component: AuthCallbackPage },
  { path: 'auth-error', component: AuthErrorPage },
  { path: '', component: ByuLayout, 
    children: [ 
      {path: '', component: HomePage}, 
      {path: 'decks', component: DecksPage, canActivate: [authGuard]},
      {path: 'decks/:deckId', component: DeckCardsPage, canActivate: [authGuard]}
    ],
  }, 
  { path: '**', component: NotFoundPage },
];
