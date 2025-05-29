import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByuLayout } from './byu.layout';

describe('ByuLayout', () => {
  let component: ByuLayout;
  let fixture: ComponentFixture<ByuLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByuLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByuLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
