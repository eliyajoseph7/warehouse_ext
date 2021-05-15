import { SharedModule } from './modules/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WarehouseIndexComponent } from './modules/definition/warehouse-index/warehouse-index.component';
import { WarehouseChartComponent } from './modules/definition/warehouse-chart/warehouse-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './modules/definition/home/home.component';
import
 { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { WarehouseComponent } from './modules/management/warehouse/warehouse.component';
import { MarketComponent } from './modules/management/market/market.component';
import { CropComponent } from './modules/management/crop/crop.component';
import { StockComponent } from './modules/management/stock/stock.component';
import { DataTablesModule } from 'angular-datatables';
import { AddWarehouseComponent } from './modules/management/add-warehouse/add-warehouse.component';
import { DeleteDataComponent } from './modules/management/delete-data/delete-data.component';
import { AddMarketComponent } from './modules/management/add-market/add-market.component';
import { AddCropComponent } from './modules/management/add-crop/add-crop.component';
import { StockTakingComponent } from './modules/management/stockComponents/stock-taking/stock-taking.component';
import { StockMovementComponent } from './modules/management/stockComponents/stock-movement/stock-movement.component';
import { GoodsReceptionComponent } from './modules/management/stockComponents/goods-reception/goods-reception.component';
import { AddStockTakingComponent } from './modules/management/stockComponents/actions/add-stock-taking/add-stock-taking.component';
import { DatePipe } from '@angular/common';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MoveStockComponent } from './modules/management/stockComponents/actions/move-stock/move-stock.component';
import { ReceiveGoodsComponent } from './modules/management/stockComponents/actions/receive-goods/receive-goods.component';

@NgModule({
  declarations: [
    AppComponent,
    WarehouseIndexComponent,
    WarehouseChartComponent,
    HomeComponent,
    WarehouseComponent,
    MarketComponent,
    CropComponent,
    StockComponent,
    AddWarehouseComponent,
    DeleteDataComponent,
    AddMarketComponent,
    AddCropComponent,
    StockTakingComponent,
    StockMovementComponent,
    GoodsReceptionComponent,
    AddStockTakingComponent,
    MoveStockComponent,
    ReceiveGoodsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    DataTablesModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
