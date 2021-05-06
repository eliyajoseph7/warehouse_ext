import { StockComponent } from './modules/management/stock/stock.component';
import { CropComponent } from './modules/management/crop/crop.component';
import { MarketComponent } from './modules/management/market/market.component';
import { SidenavComponent } from './modules/shared/components/sidenav/sidenav.component';
import { WarehouseIndexComponent } from './modules/definition/warehouse-index/warehouse-index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseChartComponent } from './modules/definition/warehouse-chart/warehouse-chart.component';
import { WarehouseComponent } from './modules/management/warehouse/warehouse.component';

const routes: Routes = [
  {path: '', component: WarehouseIndexComponent},
  {path: 'warehouse-charts', component: WarehouseChartComponent},
  {path: 'managements', component: SidenavComponent,
    children: [
      {
        path: '', component: WarehouseComponent
      },
      {
        path: 'markets', component: MarketComponent
      },
      {path: 'crops', component: CropComponent},
      {path: 'stocks', component: StockComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
