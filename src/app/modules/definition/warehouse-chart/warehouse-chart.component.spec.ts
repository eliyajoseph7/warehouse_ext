import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseChartComponent } from './warehouse-chart.component';

describe('WarehouseChartComponent', () => {
  let component: WarehouseChartComponent;
  let fixture: ComponentFixture<WarehouseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
