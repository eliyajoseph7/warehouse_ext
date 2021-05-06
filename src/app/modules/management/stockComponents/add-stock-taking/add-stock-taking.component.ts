import { ManagementService } from './../../management.service';
import { DefinitionService } from './../../../definition/definition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';


export interface DialogData {
  id;
  action;
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
  
  constructor(
    public dialogRef: MatDialogRef<AddStockTakingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private def: DefinitionService,
    private manServ: ManagementService,
  ) { }

  ngOnInit(): void {
  }

}
