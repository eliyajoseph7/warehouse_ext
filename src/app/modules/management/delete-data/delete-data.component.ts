import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagementService } from './../management.service';
import { Component, Inject, OnInit } from '@angular/core';

export interface DialogData {
  id;
  type;
}

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.component.html',
  styleUrls: ['./delete-data.component.css']
})
export class DeleteDataComponent implements OnInit {

  isLoading:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private manServ: ManagementService
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isLoading = true;
    if(this.data.type == 'warehouse'){
      this.manServ.deleteWarehouseData(this.data.id).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
    if(this.data.type == 'markets') {
      this.manServ.deleteWarehouseMarket(this.data.id).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
    if(this.data.type == 'crops') {
      this.manServ.deleteWarehouseCrop(this.data.id).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
    if(this.data.type == 'stock') {
      this.manServ.deleteStockTakingsData(this.data.id).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
    if(this.data.type == 'stock move') {
      this.manServ.deleteStockMovementData(this.data.id).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
  }

}
