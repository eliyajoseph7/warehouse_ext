import { MatDialog } from '@angular/material/dialog';
import { MoveStockComponent } from '../actions/move-stock/move-stock.component';
import { ManagementService } from './../../management.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DeleteDataComponent } from '../../delete-data/delete-data.component';

@Component({
  selector: 'app-stock-movement',
  templateUrl: './stock-movement.component.html',
  styleUrls: ['./stock-movement.component.css']
})
export class StockMovementComponent implements OnInit, AfterViewInit {

  stocks;
  constructor(
    private manServ: ManagementService,
    public dialog: MatDialog
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

  onStockMovement() {
    const dialogRef = this.dialog.open(MoveStockComponent, {
      width: '580px',
      height: '685px',
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }

  editStock(id, from, to) {
    const dialogRef = this.dialog.open(MoveStockComponent, {
      width: '580px',
      height: '685px',
      data: {id: id, from: from, to: to, action: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }

  deleteStock(id) {
    const dialogRef = this.dialog.open(DeleteDataComponent, {
      width: '500px',
      height: '300px',
      data: {id: id, type: 'stock move' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }
}
