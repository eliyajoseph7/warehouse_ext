import { AddStockTakingComponent } from '../actions/add-stock-taking/add-stock-taking.component';
import { ManagementService } from './../../management.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDataComponent } from '../../delete-data/delete-data.component';

@Component({
  selector: 'app-stock-taking',
  templateUrl: './stock-taking.component.html',
  styleUrls: ['./stock-taking.component.css']
})
export class StockTakingComponent implements OnInit {

  stocks;
  @Input() index: any;
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
    console.log(this.index)
  }

  ngAfterViewInit() {
    this.getWarehouseStocks();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

  getWarehouseStocks() {
      // stock taking
      this.manServ.stockTakingsData().subscribe(
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

  onStockTaking() {
    const dialogRef = this.dialog.open(AddStockTakingComponent, {
      width: '550px',
      height: '620px',
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }

  editStock(id, regionId) {
    const dialogRef = this.dialog.open(AddStockTakingComponent, {
      width: '550px',
      height: '620px',
      data: {id: id, region: regionId, action: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }

  deleteStock(id) {
    const dialogRef = this.dialog.open(DeleteDataComponent, {
      width: '500px',
      height: '300px',
      data: {id: id, type: 'stock' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }
}
