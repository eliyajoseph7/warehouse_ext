import { ManagementService } from './../../management/management.service';
import { DefinitionService } from './../definition.service';
import { Component, OnInit } from '@angular/core';
import  {Chart} from 'node_modules/chart.js';

@Component({
  selector: 'app-warehouse-chart',
  templateUrl: './warehouse-chart.component.html',
  styleUrls: ['./warehouse-chart.component.css']
})
export class WarehouseChartComponent implements OnInit {
regions;
districts;
crops;
stcaps;
ownership;
cropcap;
warecropcap;
  constructor(
    private def: DefinitionService,
    private manServ: ManagementService
    ) { }

  ngOnInit(): void {
    this.getRegions()
    this.getCrops();
    this.drawCharts();
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

  ownershipType(type) {
    if(type == 'gvt') {
    }
    if(type == 'prt') {
    }
  }

  registration(type) {
    if(type == 'yes') {
    }
    if(type == 'no') {
    }
  }
  getCrops() {
    this.manServ.getWarehouseCrops().subscribe(
      data => {
        this.crops = data;
      }
    );
  }

  storageByGrade() {
    this.def.getStorageByGradeData().subscribe(
      data => {
        this.stcaps = data;
        this.drawStorageByGradeChart()
      }
    );
  }

  warehouseByOwnership() {
    this.def.getWarehouseByOwnership().subscribe(
      data => {
        this.ownership = data;
        this.drawStorageByOwnershipChart()
      }
    );
  }

  storageCropAndCapacity() {
    this.def.storageCropAndCapacity().subscribe(
      data => {
        this.cropcap = data;
        this.drawStoredCropAndStorageCapacity();
      }
    );
  }

  warehouseCapacityAndCrop() {
    this.def.warehouseCapacityAndCrops().subscribe(
      data => {
        this.warecropcap = data;
        this.drawWarehouseCapacityAndCrops();
      }
    );
  }

  drawCharts() {
    this.storageByGrade();
    this.warehouseByOwnership();
    this.storageCropAndCapacity();
    this.warehouseCapacityAndCrop();
  }


  drawStorageByGradeChart() {
    var myChart
    document.getElementById('storage_grade').innerHTML = "";
    document.getElementById('storage_grade').innerHTML = '<canvas id="storage_grade_chart" style="height: 100%; width: 100%"></canvas>'
    var ctx = document.getElementById("storage_grade_chart");
    var data = {
      labels: this.stcaps[0],
      datasets: [{
        data: this.stcaps[1],
        backgroundColor: "#FDC504",
        borderColor: "white",
        barThickness: 6,
      }]
    }
    console.log(ctx)
     myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {

        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function() {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily );
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = "#AEAEAE";

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x + 18, bar._model.y + 7);
              });
            });
          }
        },
        legend: {
          "display": false,
          position: "bottom"
        },
        tooltips: {
          "enabled": false
        },
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              // labelString: this.name
            },
            gridLines: {
              display: false
            },
            ticks: {
              max: Math.max(...data.datasets[0].data) + 10,
              display: true,
              beginAtZero: true,
              fontColor: "#D6D6D6",
            }
          }],
          xAxes: [{
            gridLines: {
              display: true
            },
            ticks: {
              beginAtZero: true,
              display: false,
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }

  drawStorageByOwnershipChart() {
    var myChart
    document.getElementById('storage_ownership').innerHTML = "";
    document.getElementById('storage_ownership').innerHTML = '<canvas id="storage_ownership_chart" style="height: 100%; width: 100%"></canvas>'
    var ctx = document.getElementById("storage_ownership_chart");
    var data = {
      labels: this.ownership[0],
      datasets: [{
        data: this.ownership[1],
        backgroundColor: "#6AAC3D",
        barThickness: 10,
        minBarLength: 2,
      }]
    }
    console.log(ctx)
     myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {

        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function() {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily );
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = "#D6D6D6";

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x + 18, bar._model.y + 7);
              });
            });
          }
        },
        legend: {
          "display": false,
          position: "bottom"
        },
        tooltips: {
          "enabled": false
        },
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              // labelString: this.name
            },
            gridLines: {
              display: false
            },
            ticks: {
              max: Math.max(...data.datasets[0].data) + 10,
              display: true,
              beginAtZero: true,
              fontColor: "#AEAEAE",
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              display: false,
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }

  drawStoredCropAndStorageCapacity() {
    var myChart
    document.getElementById('storage_crop_capacity').innerHTML = "";
    document.getElementById('storage_crop_capacity').innerHTML = '<canvas id="storage_crop_capacity_chart" style="height: 100%; width: 100%"></canvas>'
    var ctx = document.getElementById("storage_crop_capacity_chart");
    var data = {
      labels: [],
      datasets: [
        {
        label: "Crop Stored",
        data: this.cropcap[0],
        backgroundColor: "#F47F33",
        barThickness: 10,
      },
        {
        label: "Storage Capacity",
        data: this.cropcap[1],
        backgroundColor: "#5399D9",
        barThickness: 10,
      }
    ]
    }
    console.log(ctx)
     myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {

        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function() {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily );
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = "#D6D6D6";

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x + 18, bar._model.y + 7);
              });
            });
          }
        },
        legend: {
          "display": true,
          position: "top",
          labels: {
            fontColor: "#D6D6D6",
            padding: 5,
            boxWidth: 10,
          }
        },
        tooltips: {
          "enabled": false
        },
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              // labelString: this.name
            },
            gridLines: {
              display: false
            },
            ticks: {
              max: Math.max(...data.datasets[0].data) + 10,
              display: true,
              beginAtZero: true,
              fontColor: "#AEAEAE",
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              display: false,
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }

  drawWarehouseCapacityAndCrops() {
    var myChart
    document.getElementById('warehouse_crop_capacity').innerHTML = "";
    document.getElementById('warehouse_crop_capacity').innerHTML = '<canvas id="warehouse_crop_capacity_chart" style="height: 100%; width: 100%"></canvas>'
    var ctx = document.getElementById("warehouse_crop_capacity_chart");


    var cropsData = {
      label: 'Stored Crops',
      data: this.warecropcap[1],
      backgroundColor: '#EF7726',
      borderWidth: 0,
      barThickness: 6,
    };


    var warehouseData = {
      label: 'Warehouse Capacity',
      data: this.warecropcap[2],
      backgroundColor: '#4A84BA',
      borderWidth: 0,
      barThickness: 6,
    };

    var graphData = {
      labels: this.warecropcap[0],
      datasets: [cropsData, warehouseData]
    };


    console.log(ctx)
     myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: graphData,
      options: {

        "hover": {
          "animationDuration": 0
        },
        "animation": {
          "duration": 1,
          "onComplete": function() {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily );
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = "#D6D6D6";

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x + 18, bar._model.y + 7);
              });
            });
          }
        },
        legend: {
          "display": true,
          position: "top",
          labels: {
            fontColor: "#D6D6D6",
            padding: 5,
            boxWidth: 10,
          }
        },
        tooltips: {
          "enabled": false
        },
        scales: {
          yAxes: [{
            display: true,
            // categoryPercentage: 1.0,
            // barPercentage: 1.0,
            scaleLabel: {
              display: true,
            },
            gridLines: {
              display: false
            },
            ticks: {
              max: Math.max(...graphData.datasets[0].data) + 10,
              display: true,
              beginAtZero: true,
              fontColor: "#AEAEAE",
            }
          }],
          xAxes: [{
            categoryPercentage: 1.0,
            barPercentage: 1.0,
            gridLines: {
              drawBorder: false,
              // display: false,
              // color: "#000",
              zeroLineColor: '#AEAEAE'
            },
            ticks: {
              beginAtZero: true,
              display: false,
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }
}
