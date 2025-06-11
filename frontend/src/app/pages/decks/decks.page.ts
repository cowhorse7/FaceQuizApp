import { Component, computed, inject, linkedSignal, runInInjectionContext, signal, EnvironmentInjector } from '@angular/core';
import { DecksService } from '../../services/decks/decks.service';
import { PageEvent } from '@angular/material/paginator';
import { debounced } from '@fhss-web-team/frontend-utils';
import { Sort } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { CreateDeckModalComponent } from '../../components/create-deck-modal/create-deck-modal.component';
import { CommonModule } from '@angular/common';

type SortOptions = 'name' | 'cards' | 'updatedAt' | 'createdAt'

@Component({
  selector: 'app-decks',
  imports: [MatInputModule, MatSortModule, MatCardModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, FormsModule, RouterLink, MatDialogModule, CommonModule],
  templateUrl: './decks.page.html',
  styleUrl: './decks.page.scss'
})
export class DecksPage {
  isModalOpen = false;
  
  formData = {
    name: '',
    description: '',
  };

  constructor(private router: Router, private injector: EnvironmentInjector){}

  goToDeck(deckId: number) {
    this.router.navigate(['/decks', deckId]);
  }

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
  decksRequest = this.service.getDecks(
    debounced(this.search),
    this.sortBy,
    this.sortDirection,
    this.PAGE_SIZE,
    computed(() => this.pageIndex() * this.PAGE_SIZE),
  );

  handlePaginationUpdate(e:PageEvent) {
    this.pageIndex.set(e.pageIndex);
  }
  onSort(sort:Sort){
    this.sortBy.set((sort.active || this.defaultSortBy) as SortOptions);
    this.sortDirection.set(sort.direction || this.defaultSortDirection);
    this.pageIndex.set(0);
  }
  readonly dialog = inject(MatDialog);
  openModal(){
    const dialogRef = this.dialog.open(CreateDeckModalComponent);
    dialogRef.afterClosed().subscribe((newId)=>{
      if(newId){
        if(
          this.search() === '' &&
          this.sortBy() === 'updatedAt' &&
          this.sortDirection() === 'desc' &&
          this.pageIndex() === 0
        ) {
          this.decksRequest.refresh();
        } else {
          this.pageIndex.set(0);
          this.search.set('');
          this.sortBy.set('updatedAt');
          this.sortDirection.set('desc');
        }
      }
    });
  }
}
