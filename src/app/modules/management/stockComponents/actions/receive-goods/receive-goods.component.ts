import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementService } from './../../../management.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

export interface DialogData {
  id;
  action;
}
@Component({
  selector: 'app-receive-goods',
  templateUrl: './receive-goods.component.html',
  styleUrls: ['./receive-goods.component.css']
})
export class ReceiveGoodsComponent implements OnInit {

  crops;
  regions;
  districts;
  amountReceived;
  district_id;
  warehouses = [];

  receptionForm = this.fb.group({
    date: ['', Validators.required],
    origin: ['', Validators.required],
    crop_id: ['', Validators.required],
    price: ['', Validators.required],
    quantity: ['', Validators.required],
    region: ['', Validators.required],
    warehouse_id: ['', Validators.required],
  });
  constructor(
    public dialogRef: MatDialogRef<ReceiveGoodsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private manServ: ManagementService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>,
  ) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    // this.receptionForm.controls['quantity'].disable()
    this.getData();
  }

  getErrorMessage() {
    return "You must enter a value";
  }

  getData() {
    this.getRegions();
  }
  // getting only regions available in stock movement
  getRegions() {
    this.manServ.getAllRegionsAvailableInStockMovement().subscribe(
      data => {
        this.regions = data;
      }
    );
  }

  onNoClick() {
    this.dialogRef.close();
  }
  getDistricts(regionId) {
    this.manServ.getDistrictsAvailableInStockMovement(regionId).subscribe(
      data => {
        this.districts = data;
      }
    );
  }

  getCrops(districtId) {
    this.manServ.getTransferedCrops(districtId).subscribe(
      data => {
        this.crops = data[0];
        this.district_id = districtId;
        if(data[1] != "no warehouse") {
          this.warehouses = data[1];
        }
        else {
          console.log('empty')
          this.snackBar.open('', 'No any warehouse has been registered in destination', {
            duration: 10000,
          });
        }
      }
      );
  }

  getAmount(cropId) {
    this.manServ.getAmountToBeReceived(this.district_id, cropId).subscribe(
      data => {
        this.amountReceived = data;
        this.receptionForm.get('quantity').setValue(this.amountReceived);
      }
    );
  }

  onSubmit() {
    if(this.receptionForm.valid) {
      this.manServ.receiveGoods(this.receptionForm.value).subscribe(
        (data: string) => {
          this.snackBar.open('', data, {
            duration: 5000,
          });
          this.onNoClick();
        }
      );
    }
  }
}
