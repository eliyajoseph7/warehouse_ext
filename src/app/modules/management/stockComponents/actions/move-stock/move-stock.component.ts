import { MatSnackBar } from '@angular/material/snack-bar';
import { DefinitionService } from '../../../../definition/definition.service';
import { ManagementService } from '../../../management.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

export interface DialogData {
  id;
  action;
  from,
  to,
  type;
}
@Component({
  selector: 'app-move-stock',
  templateUrl: './move-stock.component.html',
  styleUrls: ['./move-stock.component.css']
})
export class MoveStockComponent implements OnInit {

  crops;
  fromRegions;
  regions;
  from;
  destination;

  edit;
  moveStockForm = this.fb.group({
    trader_name: ['', Validators.required],
    date: ['', Validators.required],
    from: ['', Validators.required],
    to: ['', Validators.required],
    crop_id: ['', Validators.required],
    amount: ['', Validators.required],
    region: ['']
  });

  moveStockFormEdit = this.fb.group({
    trader_name: ['', Validators.required],
    date: ['', Validators.required],
    from: ['', Validators.required],
    to: ['', Validators.required],
    crop_id: ['', Validators.required],
    amount: ['', Validators.required],
    regionFrom: [''],
    regionTo: ['']
  });

  constructor(
    public dialogRef: MatDialogRef<MoveStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private manServ: ManagementService,
    private def: DefinitionService,
    private dateAdapter: DateAdapter<Date>,
    private snackBar: MatSnackBar
  ) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.getInitialData();

    if(this.data.action == 'edit') {
      this.getFromDistricts(this.data.from.region_id);
      this.getDestinationDistricts(this.data.to.region_id);
      this.manServ.getMovingStock(this.data.id).subscribe(
        data => {
          this.edit = data;
          this.moveStockFormEdit.get('trader_name').setValue(this.edit.trader_name);
          this.moveStockFormEdit.get('regionFrom').setValue(this.data.from.region_id);
          this.moveStockFormEdit.get('from').setValue(this.data.from.id);
          this.moveStockFormEdit.get('regionTo').setValue(this.data.to.region_id);
          this.moveStockFormEdit.get('to').setValue(this.data.to.id);
          this.moveStockFormEdit.get('amount').setValue(this.edit.amount);
          this.moveStockFormEdit.get('date').setValue(this.edit.date);
          this.moveStockFormEdit.get('crop_id').setValue(this.edit.crop_id);
        }
      );
    }
  }

  getErrorMessage() {
    return "You must Enter a value";
  }

  getInitialData() {
    this.getFromRegions();
    this.getRegions();
    this.getCrops();
  }
  getFromRegions() {
    this.manServ.getAllRegionsAvailableInStockTaking().subscribe(
      data => {
        this.fromRegions = data;
      }
    );
  }
  getRegions() {
    this.def.getAllRegions().subscribe(
      data => {
        this.regions = data;
      }
    );
  }

  getCrops() {
    this.manServ.getWarehouseCrops().subscribe(
      data => {
        this.crops = data;
      }
    );
  }

  getFromDistricts(region) {
    this.manServ.getAllDistrictsAvailableInStockTaking(region).subscribe(
      data => {
        this.from = data;
      }
    );
  }

  getDestinationDistricts(region) {
    this.def.getDistricts(region).subscribe(
      data => {
        this.destination = data;
      }
    );
  }


  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.moveStockForm.valid) {
      this.manServ.moveStock(this.moveStockForm.value).subscribe(
        (data: string) => {
          if(data != "Amount to be moved exceeds the available amount") {
            this.onNoClick();
          }else {
            this.snackBar.open('error', data, {
              duration: 5000,
            });
          }
        }
      );
    }
  }

  onUpdate() {
    if(this.moveStockFormEdit.valid) {
      this.manServ.moveStockUpdate(this.moveStockFormEdit.value, this.data.id).subscribe(
        (data: string) => {
          if(data != "Amount to be moved exceeds the available amount") {
            this.onNoClick();
          }else {
            this.snackBar.open('error', data, {
              duration: 5000,
            });
          }
        }
      );
    }
  }
}
