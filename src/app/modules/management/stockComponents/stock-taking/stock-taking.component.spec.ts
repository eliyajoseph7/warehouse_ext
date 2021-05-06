import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTakingComponent } from './stock-taking.component';

describe('StockTakingComponent', () => {
  let component: StockTakingComponent;
  let fixture: ComponentFixture<StockTakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockTakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
