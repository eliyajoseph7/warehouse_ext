import { AddMarketComponent } from './../add-market/add-market.component';
import { ManagementService } from './../management.service';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DeleteDataComponent } from '../delete-data/delete-data.component';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit, AfterViewInit {

  markets
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtCheck:boolean = false;
  constructor(
    public dialog: MatDialog,
    private manServ: ManagementService
    ) { }


  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getWarehouseMarkets();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

  onAddMarket() {
    const dialogRef = this.dialog.open(AddMarketComponent, {
      width: '500px',
      height: '500px',
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.getWarehouseMarkets();
    })
  }

  editMarket(id, region) {
    const dialogRef = this.dialog.open(AddMarketComponent, {
      width: '500px',
      height: '500px',
      data: {id: id, region: region, action: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.getWarehouseMarkets();
    })
  }

  deleteMarket(id) {
    const dialogRef = this.dialog.open(DeleteDataComponent, {
      width: '500px',
      height: '300px',
      data: {id: id, type: 'markets' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseMarkets();
    })
  }

  getWarehouseMarkets() {
    this.manServ.getWarehouseMarkets().subscribe(
      data => {
        this.markets = data;

        this.rerender()
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
}
