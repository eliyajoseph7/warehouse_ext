import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockTakingComponent } from './add-stock-taking.component';

describe('AddStockTakingComponent', () => {
  let component: AddStockTakingComponent;
  let fixture: ComponentFixture<AddStockTakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockTakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockTakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
