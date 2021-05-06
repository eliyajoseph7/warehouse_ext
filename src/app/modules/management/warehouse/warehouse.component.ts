import { ManagementService } from './../management.service';
import { AddWarehouseComponent } from './../add-warehouse/add-warehouse.component';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DeleteDataComponent } from '../delete-data/delete-data.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtCheck:boolean = false;
  warehouses;
  constructor(
    public dialog: MatDialog,
    private manServ: ManagementService
    ) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.getWarehouseData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }

  onAddWarehouse() {
    const dialogRef = this.dialog.open(AddWarehouseComponent, {
      width: '700px',
      height: '560px',
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.getWarehouseData();
    })
  }

  editWarehouse(id, regionId) {
    console.log(regionId)
    const dialogRef = this.dialog.open(AddWarehouseComponent, {
      width: '700px',
      height: '560px',
      data: {id: id, action: 'edit', region: regionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.getWarehouseData();
    })
  }

  deleteWarehouse(id) {
    const dialogRef = this.dialog.open(DeleteDataComponent, {
      width: '500px',
      height: '300px',
      data: {id: id, type: 'warehouse' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseData();
    })
  }

  getWarehouseData() {
    this.manServ.getWarehouseData().subscribe(
      data => {
        this.warehouses = data;

        this.rerender()
      }
    )
  }
  rerender(): void {
    if(this.dtCheck){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
          //  $('#dtb').DataTable();
      });
    }
    else {
      this.dtCheck = true;
      this.dtTrigger.next();
    }

  }
}
