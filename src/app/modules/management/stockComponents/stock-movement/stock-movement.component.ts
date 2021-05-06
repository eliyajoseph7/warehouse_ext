import { ManagementService } from './../../management.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stock-movement',
  templateUrl: './stock-movement.component.html',
  styleUrls: ['./stock-movement.component.css']
})
export class StockMovementComponent implements OnInit, AfterViewInit {

  stocks;
  constructor(
    private manServ: ManagementService
  ) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtCheck:boolean = false;
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getWarehouseStocks();
    this.dtCheck = false;
    this.rerender();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

  getWarehouseStocks() {
      // stock movement
      this.manServ.stockMovementsData().subscribe(
        data => {
          this.stocks = data;
          this.rerender();
        }
      );
  }

  rerender(): void {
    if(this.dtCheck){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
      });
    }
    else {
      this.dtCheck = true;
      this.dtTrigger.next();
    }

  }
}
