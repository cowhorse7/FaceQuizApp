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
}
