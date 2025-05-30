import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCardsPage } from './deck-cards.page';

describe('DeckCardsPage', () => {
  let component: DeckCardsPage;
  let fixture: ComponentFixture<DeckCardsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckCardsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckCardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
