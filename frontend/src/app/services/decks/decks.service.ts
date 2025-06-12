import { inject, Injectable, Signal } from '@angular/core';
import { AuthService, fetchSignal } from '@fhss-web-team/frontend-utils';

type GetDecksResponse = {
  data: {
    id: number;
    name: string;
    description: string;
    size: number;
  }[];
  totalCount: number;
};
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
};
type CreateDeckResponse = { id: number; name: string };
type UpdateDeckResponse = { id: number; name: string; description?: string; };

@Injectable({
  providedIn: 'root'
})
export class DecksService {
  auth = inject(AuthService);
  getDecks(
    filterName: Signal<string>,
    sortBy: Signal<'name'|'cards'|'updatedAt'|'createdAt'>,
    sortDirection: Signal<'asc'|'desc'>,
    pageCount: number,
    pageOffset: Signal<number>,
  ){
    return fetchSignal<GetDecksResponse>(
      () => ({
        url:'/api/decks/',
        params: {
          filter_name: filterName(),
          sort_by: sortBy(),
          sort_direction: sortDirection(),
          page_count: pageCount,
          page_offset: pageOffset(),
        },
        headers: {
          Authorization: this.auth.bearerToken() ?? '',
        },
      }),
      true,
    );
  }

  getDeck(deckId: number){
    return fetchSignal.put<UpdateDeckResponse>(()=>({
      url:'/api/decks/'+ deckId,
      headers: {
        Authorization: this.auth.bearerToken() ?? '',
      },
    }),
);
  };

  createDeck(name: Signal<string>, description: Signal<string>){

    return fetchSignal.post<CreateDeckResponse>(()=>({
      url:'/api/decks/',
      body: {
        name: name(),
        description: description(),
      },
      headers: {
        Authorization: this.auth.bearerToken() ?? '',
      },
    }),
);
  }

  updateDeck(name: Signal<string>, description: Signal<string>, deckId: number){

    return fetchSignal.put<UpdateDeckResponse>(()=>({
      url:'/api/decks/'+ deckId,
      body: {
        name: name(),
        description: description(),
      },
      headers: {
        Authorization: this.auth.bearerToken() ?? '',
      },
    }),
);
  }
}
