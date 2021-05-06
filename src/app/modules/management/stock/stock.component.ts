import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  index = 0;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('index => ', tabChangeEvent.index);
    this.index = tabChangeEvent.index;
  }


}
