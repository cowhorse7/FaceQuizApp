import { Component, inject, linkedSignal } from '@angular/core';
import { DeckCardsService } from '../../services/deckcards/deckcards.service';
import { PageEvent } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deck-cards',
  imports: [MatPaginatorModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './deck-cards.page.html',
  styleUrl: './deck-cards.page.scss'
})
export class DeckCardsPage {
  private route = inject(ActivatedRoute);

  
  id = this.route.snapshot.params['deckId'];

  readonly PAGE_SIZE = 12;
  pageIndex = linkedSignal(() => {
    return 0;
  });
  // computed(() => this.pageIndex() * this.PAGE_SIZE)

  service = inject(DeckCardsService);
  deckRequest = this.service.getDeck(this.id);

  handlePaginationUpdate(e:PageEvent) {
    this.pageIndex.set(e.pageIndex);
  }
}
