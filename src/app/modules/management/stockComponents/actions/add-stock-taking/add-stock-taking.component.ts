import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementService } from '../../../management.service';
import { DefinitionService } from '../../../../definition/definition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';


export interface DialogData {
  id;
  action;
  region;
}
@Component({
  selector: 'app-add-stock-taking',
  templateUrl: './add-stock-taking.component.html',
  styleUrls: ['./add-stock-taking.component.css']
})
export class AddStockTakingComponent implements OnInit {
  warehouses;
  regions;
  districts;
  crops;
  edit;

  stockTakingForm = this.fb.group({
    date: ['', Validators.required],
    warehouse_id: ['', Validators.required],
    crop_id: ['', Validators.required],
    amount: ['', Validators.required],
    district_id: ['', Validators.required],
    region_id: [''],
  });

  stockTakingFormEdit = this.fb.group({
    date: ['', Validators.required],
    warehouse_id: ['', Validators.required],
    crop_id: ['', Validators.required],
    amount: ['', Validators.required],
    district_id: ['', Validators.required],
    region_id: [''],
  });

  constructor(
    public dialogRef: MatDialogRef<AddStockTakingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private def: DefinitionService,
    private manServ: ManagementService,
    private dateAdapter: DateAdapter<Date>,
    private snackBar: MatSnackBar

  ) { this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
 }

  ngOnInit(): void {
    this.getData();
    if(this.data.action == 'edit') {
      this.getDistricts(this.data.region);

      this.manServ.getStockTakingSingleData(this.data.id).subscribe(
        res => {
          this.edit = res;
          this.stockTakingFormEdit.get('date').setValue(this.edit.date);
          this.stockTakingFormEdit.get('warehouse_id').setValue(this.edit.warehouse_id);
          this.stockTakingFormEdit.get('crop_id').setValue(this.edit.crop_id);
          this.stockTakingFormEdit.get('amount').setValue(this.edit.amount);
          this.stockTakingFormEdit.get('region_id').setValue(this.data.region);
          this.stockTakingFormEdit.get('district_id').setValue(this.edit.district_id);
        }
      )
    }
  }

  getErrorMessage() {
    return "You must enter a value";
  }

  getData() {
    this.getCrops();
    this.getRegions();
  }


  getWarehouses(regionId) {
    this.manServ.getWarehouseDataByRegion(regionId).subscribe(
      data => {
        this.warehouses = data;
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

  getRegions() {
    this.def.getAllRegions().subscribe(
      data => {
        this.regions = data;
      }
    )
  }

  getDistricts(regionId) {
    this.def.getDistricts(regionId).subscribe(
      data => {
        this.districts = data;
      }
    );
    this.getWarehouses(regionId);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.stockTakingForm.valid) {
      this.manServ.addStockTakingsData(this.stockTakingForm.value).subscribe(
        (resp: string) => {
          if(resp == "The taken amount exceeded warehouse capacity"){
            this.snackBar.open('error', resp, {
              duration: 5000,
            });
          }else {
            this.onNoClick();
          }
        }
      );
    }
  }

  onUpdate() {
    if(this.stockTakingFormEdit.valid) {
      this.manServ.updateStockTakingsData(this.stockTakingFormEdit.value, this.data.id).subscribe(
        (resp: string) => {
          if(resp == "The taken amount exceeded warehouse capacity"){
            this.snackBar.open('error', resp, {
              duration: 5000,
            });
          }else {
            this.onNoClick();
          }
        }
      );
    }
  }
}
