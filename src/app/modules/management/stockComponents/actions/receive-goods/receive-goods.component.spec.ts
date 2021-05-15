import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveGoodsComponent } from './receive-goods.component';

describe('ReceiveGoodsComponent', () => {
  let component: ReceiveGoodsComponent;
  let fixture: ComponentFixture<ReceiveGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
