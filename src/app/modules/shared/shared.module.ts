import { MoveStockComponent } from '../management/stockComponents/actions/move-stock/move-stock.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddStockTakingComponent } from '../management/stockComponents/actions/add-stock-taking/add-stock-taking.component';
import { AddCropComponent } from './../management/add-crop/add-crop.component';
import { AddMarketComponent } from './../management/add-market/add-market.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from './components/sidenav/sidenav.component';


import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import { AddWarehouseComponent } from '../management/add-warehouse/add-warehouse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeleteDataComponent } from '../management/delete-data/delete-data.component';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ReceiveGoodsComponent } from '../management/stockComponents/actions/receive-goods/receive-goods.component';


const Material = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatDialogModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatSnackBarModule
]

@NgModule({
  declarations: [HeaderComponent, SidenavComponent],
  imports: [
    CommonModule,
    Material,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    Material
  ],
  entryComponents: [
    AddWarehouseComponent,
    DeleteDataComponent,
    AddMarketComponent,
    AddCropComponent,
    AddStockTakingComponent,
    MoveStockComponent,
    ReceiveGoodsComponent
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },DatePipe
  ]
})
export class SharedModule { }
