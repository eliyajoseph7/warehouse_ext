import { AddCropComponent } from './../add-crop/add-crop.component';
import { MatDialog } from '@angular/material/dialog';
import { ManagementService } from './../management.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DeleteDataComponent } from '../delete-data/delete-data.component';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css']
})
export class CropComponent implements OnInit, AfterViewInit {

  crops;
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
    this.getWarehouseCrops();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }
  onAddCrop() {
    const dialogRef = this.dialog.open(AddCropComponent, {
      width: '500px',
      height: '320px',
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.getWarehouseCrops();
    })
  }


  editCrop(id) {
    const dialogRef = this.dialog.open(AddCropComponent, {
      width: '500px',
      height: '320px',
      data: {id: id, action: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.getWarehouseCrops();
    })
  }

  deleteCrop(id) {
    const dialogRef = this.dialog.open(DeleteDataComponent, {
      width: '500px',
      height: '300px',
      data: {id: id, type: 'crops' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWarehouseCrops();
    })
  }

  getWarehouseCrops() {
    this.manServ.getWarehouseCrops().subscribe(
      data => {
        this.crops = data;
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
}
