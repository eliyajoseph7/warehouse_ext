import { ManagementService } from './../management.service';
import { DefinitionService } from './../../definition/definition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export interface DialogData{
  id;
  action;
}
@Component({
  selector: 'app-add-crop',
  templateUrl: './add-crop.component.html',
  styleUrls: ['./add-crop.component.css']
})
export class AddCropComponent implements OnInit {

  edit;
  cropsForm = this.fb.group({
    name: ['', Validators.required],
    grade: ['', Validators.required],
  });

  cropsFormEdit = this.fb.group({
    name: ['', Validators.required],
    grade: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<AddCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
     private fb: FormBuilder,
     private def: DefinitionService,
     private manServ: ManagementService,
  ) { }

  ngOnInit(): void {
    if(this.data.action == 'edit') {
      this.manServ.getWarehouseSingleCrop(this.data.id).subscribe(
        res => {
          this.edit = res;
          this.cropsFormEdit.get('name').setValue(this.edit.name);
          this.cropsFormEdit.get('grade').setValue(this.edit.grade);
        }
      )
    }
  }

  getErrorMessage() {
    return "This field is required";
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.cropsForm.valid) {
      this.manServ.addWarehouseCrop(this.cropsForm.value).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
  }

  onUpdate() {
    if(this.cropsFormEdit.valid) {
      this.manServ.updateWarehouseCrop(this.cropsFormEdit.value, this.data.id).subscribe(
        resp => {
          this.onNoClick();
        }
      )
    }
  }
}
