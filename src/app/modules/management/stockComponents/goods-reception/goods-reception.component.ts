import { ManagementService } from './../../management.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ReceiveGoodsComponent } from '../actions/receive-goods/receive-goods.component';

@Component({
  selector: 'app-goods-reception',
  templateUrl: './goods-reception.component.html',
  styleUrls: ['./goods-reception.component.css']
})
export class GoodsReceptionComponent implements OnInit, AfterViewInit {

  stocks;
  constructor(
    private manServ:ManagementService,
    private dialog: MatDialog
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

  getWarehouseStocks() {
      // goods reception
      this.manServ.goodsReceptionData().subscribe(
        data => {
          this.stocks = data;
          this.rerender();
        }
      )
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

  onReceivingGoods() {
    const dialogRef = this.dialog.open(ReceiveGoodsComponent, {
      width: '590px',
      height: '650px',
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseStocks();
    })
  }
}
