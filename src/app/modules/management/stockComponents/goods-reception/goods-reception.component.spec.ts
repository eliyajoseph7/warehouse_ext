import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceptionComponent } from './goods-reception.component';

describe('GoodsReceptionComponent', () => {
  let component: GoodsReceptionComponent;
  let fixture: ComponentFixture<GoodsReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
