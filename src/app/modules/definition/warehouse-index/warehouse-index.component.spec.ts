import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseIndexComponent } from './warehouse-index.component';

describe('WarehouseIndexComponent', () => {
  let component: WarehouseIndexComponent;
  let fixture: ComponentFixture<WarehouseIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
