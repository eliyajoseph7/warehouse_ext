import { ManagementService } from './../management.service';
import { DefinitionService } from './../../definition/definition.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id;
  action;
  region;
}

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.css']
})
export class AddWarehouseComponent implements OnInit {
  regions;
  districts;
  edit

  warehouseForm = this.fb.group({
    name : ['', Validators.required],
    capacity : ['', Validators.required],
    licensed_by : [''],
    grade : ['', Validators.required],
    type : ['', Validators.required],
    districtId : ['', Validators.required],
    regionId : ['', Validators.required],
  });

  editForm = this.fb.group({
    name : ['', Validators.required],
    capacity : ['', Validators.required],
    licensed_by : [''],
    grade : ['', Validators.required],
    type : ['', Validators.required],
    districtId : ['', Validators.required],
    regionId : ['', Validators.required],
  })
  constructor(
    public dialogRef: MatDialogRef<AddWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private def: DefinitionService,
    private manServ: ManagementService,
  ) { }

  ngOnInit(): void {
    this.getRegions();
    if(this.data.action == 'edit') {
      this.getDistricts(this.data.region);

      this.manServ.getWarehouseSingleData(this.data.id).subscribe(
        res => {
          this.edit = res;
          this.editForm.get('name').setValue(this.edit.name);
          this.editForm.get('capacity').setValue(this.edit.capacity);
          this.editForm.get('licensed_by').setValue(this.edit.licensed_by);
          this.editForm.get('grade').setValue(this.edit.grade);
          this.editForm.get('type').setValue(this.edit.type);
          this.editForm.get('regionId').setValue(this.edit.region_id);
          this.editForm.get('districtId').setValue(this.edit.district_id);
        }
      )
    }
  }


  onSubmit() {
    if(this.warehouseForm.valid) {
      this.manServ.addWarehouseData(this.warehouseForm.value).subscribe(
        data => {
          this.onNoclick();
        },
        error => {
          console.log(error);
        }
      )
    }
  }


  onUpdate() {
    if(this.editForm.valid) {
      this.manServ.updateWarehouseData(this.editForm.value, this.data.id).subscribe(
        data => {
          this.onNoclick();
        },
        error => {
          console.log(error);
        }
      )
    }
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

  onNoclick() {
    this.dialogRef.close();
  }
}
