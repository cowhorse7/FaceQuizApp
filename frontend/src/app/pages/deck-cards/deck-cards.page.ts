import { Component, inject, linkedSignal } from '@angular/core';
import { DeckCardsService } from '../../services/deckcards/deckcards.service';
import { PageEvent } from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../../components/add-card/add-card.component';
import { MatIcon } from '@angular/material/icon';
import { EditDeckComponent } from '../../components/edit-deck/edit-deck.component';


@Component({
  selector: 'app-deck-cards',
  imports: [MatPaginatorModule, MatProgressSpinnerModule, MatCardModule, FormsModule, MatIcon],
  templateUrl: './deck-cards.page.html',
  styleUrl: './deck-cards.page.scss'
})
export class DeckCardsPage {
  formData = {
    name: '',
    department: '',
    image: '',
  };

  constructor(private location: Location){}

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

  goBack(){this.location.back();}

  addCard(){

  }
  readonly dialog = inject(MatDialog);
  openEditDeck(){
    const dialogRef = this.dialog.open(EditDeckComponent, {
      data: this.id,
    });
  }
  openAddCard(){
      const dialogRef = this.dialog.open(AddCardComponent);
  }
}
