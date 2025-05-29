import { Component, inject, linkedSignal, signal } from '@angular/core';
import { DecksService } from '../../services/decks/decks.service';

@Component({
  selector: 'app-decks',
  imports: [],
  templateUrl: './decks.page.html',
  styleUrl: './decks.page.scss'
})
export class DecksPage {
  search = signal('');

  readonly PAGE_SIZE = 12;
  pageIndex = linkedSignal(() => {
    this.search();
    return 0;
  });

  sortOptions = ['name', 'cards', 'updatedAt', 'createdAt'];
  readonly defaultSortBy = 'updatedAt'
  sortBy = signal<SortOptions>(this.defaultSortBy);
  readonly defaultSortDirection = 'desc'
  sortDirection = signal<'asc' | 'desc'>(this.defaultSortDirection);

  service = inject(DecksService);
}
