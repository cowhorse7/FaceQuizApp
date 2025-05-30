import { inject, Injectable } from '@angular/core';
  import { AuthService, fetchSignal } from '@fhss-web-team/frontend-utils';

type GetDeckResponse = {
  id: number;
  name: string;
  description: string;
  cards: {
    id: number;
    personName: string;
    personDepartment: string;
    imageUrl: string | null;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DeckCardsService {
    auth = inject(AuthService);
    getDeck(deckId: number){
      return fetchSignal<GetDeckResponse>(
        () => ({
          url:`/api/decks/${deckId}`,
          headers: {
            Authorization: this.auth.bearerToken() ?? '',
          },
        }),
        true,
      );
    }
  }
