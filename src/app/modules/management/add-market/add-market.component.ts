import { ManagementService } from './../management.service';
import { DefinitionService } from './../../definition/definition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  id;
  action;
  region;
}
@Component({
  selector: 'app-add-market',
  templateUrl: './add-market.component.html',
  styleUrls: ['./add-market.component.css']
})
export class AddMarketComponent implements OnInit {

  regions;
  districts;
  edit;

  marketForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    regionId: ['', Validators.required],
    districtId: ['', Validators.required],
  });

  marketFormEdit = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    regionId: ['', Validators.required],
    districtId: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<AddMarketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private def: DefinitionService,
    private manServ: ManagementService,
  ) { }

  ngOnInit(): void {
    this.getRegions();
    if(this.data.action == 'edit') {
      this.getDistricts(this.data.region);

      this.manServ.getWarehouseSingleMarket(this.data.id).subscribe(
        res => {
          this.edit = res;
          this.marketFormEdit.get('name').setValue(this.edit.name);
          this.marketFormEdit.get('type').setValue(this.edit.type);
          this.marketFormEdit.get('regionId').setValue(this.edit.region_id);
          this.marketFormEdit.get('districtId').setValue(this.edit.district_id);
        }
      )
    }
  }

  getErrorMessage() {
    return "This field is required";
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
    )
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.marketForm.valid) {
      this.manServ.addWarehouseMarket(this.marketForm.value).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
  }

  onUpdate() {
    if(this.marketFormEdit.valid) {
      this.manServ.updateWarehouseMarket(this.marketFormEdit.value, this.data.id).subscribe(
        data => {
          this.onNoClick();
        },
        error => {
          console.log(error);
        }
      )
    }
  }
}
