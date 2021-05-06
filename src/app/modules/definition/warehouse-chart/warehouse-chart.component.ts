import { DefinitionService } from './../definition.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warehouse-chart',
  templateUrl: './warehouse-chart.component.html',
  styleUrls: ['./warehouse-chart.component.css']
})
export class WarehouseChartComponent implements OnInit {
regions;
districts;
neutral = 'neutral';
normal = 'normal';
crops;
  constructor(private def: DefinitionService) { }

  ngOnInit(): void {
    this.getRegions()
  }

  getRegions() {
    this.def.getAllRegions().subscribe(
      data => {
        this.regions = data;
        // console.log(this.regions)
      }
    )
  }

  getDistricts(regionId) {
    this.def.getDistricts(regionId).subscribe(
      data => {
        this.districts = data;
        // console.log(this.districts)
      }
    )
  }

  selectCrop(cropId) {

  }
  selectRegion(id) {
    this.getDistricts(id);
  }

  selectDistrict(id) {
    console.log(id);
  }

  ownership(type) {
    if(type == 'gvt') {
      this.neutral = 'gvt'
    }
    if(type == 'prt') {
      this.neutral = 'prt'
    }
  }

  registration(type) {
    if(type == 'yes') {
      this.normal = 'yes'
    }
    if(type == 'no') {
      this.normal = 'no'
    }
  }
}
