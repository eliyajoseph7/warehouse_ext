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
cropGrades;
regions;
districts;
crops;
stcaps;
ownership;
cropcap;
cropsLocation;
warecropcap;
utilization;
hide:boolean = true;
ownLabel;
ownershipColor;
ownershipTitle;

// filter variables
selectedRegion = null;
selectedDistrict = null;
selectedOwnership = null;
selectedRegistration = null;
selectedCrop = null;
selectedCropGrade = null;

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
    );
  }

  selectCrop(cropId) {
    this.selectedCrop = cropId;
    this.filter();
  }

  selectCropGrade(grade) {
    this.selectedCropGrade = grade;
    this.filter();
  }
  selectRegion(id) {
    this.selectedRegion = id;
    this.getDistricts(id);
    this.filter();
  }

  selectDistrict(id) {
    this.selectedDistrict = id;
    this.filter();
  }

  selectOwnership(type) {
    this.selectedOwnership = type;
    this.filter()
  }

  selectRegistration(registered) {
    this.selectedRegistration = registered;
    this.filter()
  }


  getCrops() {
    this.manServ.getWarehouseCrops().subscribe(
      data => {
        this.crops = data[0];
        this.cropGrades = data[1];
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
        this.ownershipTitle = "Warehouse by Ownership";
        this.ownLabel = "";
        this.ownership = data;
        this.ownershipColor = "#6AAC3D";
        this.drawStorageByOwnershipChart();
        this.hide = true;
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

  warehouseUtilization() {
    this.def.warehouseUtilization().subscribe(
      data => {
        this.utilization = data;
        this.drawWarehouseUtilization();
      }
    );
  }

  cropsByLocation() {
    this.def.storedCropsByLocation().subscribe(
      data => {
        this.cropsLocation = data;
        this.drawStoredCropsByLocationChart();
      }
    );
  }

  drawCharts() {
    this.storageByGrade();
    this.warehouseByOwnership();
    this.storageCropAndCapacity();
    this.warehouseCapacityAndCrop();
    this.warehouseUtilization();
    this.cropsByLocation();
  }



  drawStoredCropsByLocationChart() {
    var myChart
    document.getElementById('crop_location').innerHTML = "";
    document.getElementById('crop_location').innerHTML = '<canvas id="crop_location_chart" style="height: 100%; width: 100%"></canvas>'
    var ctx = document.getElementById("crop_location_chart");
    var data = {
      labels: this.cropsLocation[0],
      datasets: [{
        data: this.cropsLocation[1],
        backgroundColor: "#5096D6",
        borderColor: "white",
        barThickness: 6,
      }]
    }

     myChart = new Chart(ctx, {
      type: 'bar',
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
                var data = numberWithCommas(dataset.data[index]);
                ctx.fillText(data, bar._model.x - 4, bar._model.y - 3);
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
              display: true,
              zeroLineColor: '#AEAEAE'
            },
            ticks: {
              // max: Math.max(...data.datasets[0].data) - 10,
              display: false,
              beginAtZero: true,
              fontColor: "#D6D6D6",
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              max: Math.max(...data.datasets[0].data) + 100,
              beginAtZero: true,
              display: true,
              fontColor: "#D6D6D6",
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90
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
                var data = numberWithCommas(dataset.data[index]);
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
        backgroundColor: this.ownershipColor,
        barThickness: 10,
        minBarLength: 2,
      }]
    }
    let $this = this;

     myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {
        onClick: function (e) {
          var category = this.getElementsAtEvent(e)[0]._model.datasetLabel;
          var activePointLabel = this.getElementsAtEvent(e)[0]._model.label;
          $this.drillDownToRegistration(activePointLabel);
      },
      onHover: (event, chartElement) => {
        event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      },
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
                var data = numberWithCommas(dataset.data[index]);
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
              labelString: this.ownLabel,
              fontColor: "white"
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
                var data = numberWithCommas(dataset.data[index]);
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
                var data = numberWithCommas(dataset.data[index]);
                ctx.fillText(data, bar._model.x + 18, bar._model.y + 5);
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

  drawWarehouseUtilization() {
    var myChart
    document.getElementById('warehouse_utilization').innerHTML = "";
    document.getElementById('warehouse_utilization').innerHTML = '<canvas id="warehouse_utilization_chart" style="height: 100%; width: 100%"></canvas>'
    var ctx = document.getElementById("warehouse_utilization_chart");


    var data = {
      labels: this.utilization[0],
      datasets: [
        {
        data: this.utilization[1],
        backgroundColor: "#5197D6",
        barThickness: 10,
      }
    ]
    }



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
                var data = dataset.data[index] + '%';
                ctx.fillText(data, bar._model.x + 23, bar._model.y + 7);
              });
            });
          }
        },
        legend: {
          "display": false,
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
              max: Math.max(...data.datasets[0].data) + 10,
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


  // getting specific warehouse ownership registration info
  drillDownToRegistration(type) {
    this.def.warehouseOwnershipRegistration(type).subscribe(
      data => {
        this.ownershipTitle = "Warehouse Registration";
        this.ownLabel  = type
        this.ownership = data;
        this.ownershipColor = "#2678C5";
        this.drawStorageByOwnershipChart();
        this.hide = false;
      }
    )
  }


  drawFilteredGraphs() {
    this.drawStoredCropsByLocationChart();
    this.drawStorageByGradeChart();
    this.drawStorageByOwnershipChart();
    this.drawStoredCropAndStorageCapacity();
    this.drawWarehouseCapacityAndCrops();
    this.drawWarehouseUtilization();
  }
  // filters
  filter() {

    // filter without involving district
    if(this.selectedDistrict == null) {
      // All combinations
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.filterWithExceptionOfDistrict(this.selectedRegion, this.selectedOwnership, this.selectedRegistration, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      //==========One is excluded==========//
      // only selectedCropGrade is null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.filterDistrictExceptCropGrade(this.selectedRegion, this.selectedDistrict, this.selectedOwnership, this.selectedRegistration, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only crop is null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtAndCropAreNull(this.selectedRegion, this.selectedOwnership, this.selectedRegistration, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only registration is null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtAndRegistrationAreNull(this.selectedRegion, this.selectedOwnership, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only ownership is null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtAndOwnershipAreNull(this.selectedRegion, this.selectedRegistration, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only region is null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtAndRegionAreNull(this.selectedOwnership, this.selectedRegistration, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }
      //==========end exclusion of one==========//

      //==========two are excluded==========//
      // crop and grade are null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.filterByRegionOwnershipAndRegistration(this.selectedRegion, this.selectedOwnership, this.selectedRegistration).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // registration and grade are null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtRegistrationAndGradeAreNull(this.selectedRegion, this.selectedOwnership, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // ownership and grade are null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtOwnershipAndGradeAreNull(this.selectedRegion, this.selectedRegistration, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and grade are null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtRegionAndGradeAreNull(this.selectedOwnership, this.selectedRegistration, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // registration and crop are null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtRegistrationAndCropAreNull(this.selectedRegion, this.selectedOwnership, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // ownership and crop are null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtOwnershipAndCropAreNull(this.selectedRegion, this.selectedRegistration, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and crop are null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtRegionAndCropAreNull(this.selectedOwnership, this.selectedRegistration, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // ownership and registration are null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtOwnershipAndRegistrationAreNull(this.selectedRegion, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and registration are null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtRegionAndRegistrationAreNull(this.selectedOwnership, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and ownership are null
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtRegionAndOwnershipAreNull(this.selectedRegistration, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }
      //==========end exclusion of two==========//

      //==========three are excluded==========//
      // region and ownership are not null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.districtRegionAndOwnershipAreNotNull(this.selectedRegion, this.selectedOwnership).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and registration are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.districtRegionAndRegistrationAreNotNull(this.selectedRegion, this.selectedRegistration).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and crop are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtRegionAndCropAreNotNull(this.selectedRegion, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and grade are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtRegionAndCropGradeAreNotNull(this.selectedRegion, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // ownership and registration are not null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.districtOwnershipAndRegistrationAreNotNull(this.selectedOwnership, this.selectedRegistration).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // ownership and crop are not null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtOwnershipAndCropAreNotNull(this.selectedOwnership, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // ownership and grade are not null
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtOwnershipAndCropGradeAreNotNull(this.selectedOwnership, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // registration and crop are not null
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtRegistrationAndCropAreNotNull(this.selectedRegistration, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // registration and grade are not null
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtRegistrationAndCropGradeAreNotNull(this.selectedRegistration, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // crop and grade are not null
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.districtCropAndCropGradeAreNotNull(this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      //==========end exclusion of three==========//

      //==========only one is not null==========//
      // region is not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.filterByOnlyRegion(this.selectedRegion).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only ownership
      if(this.selectedRegion == null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.districtOwnershipAreNotNull(this.selectedOwnership).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only registration
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.districtRegistrationAreNotNull(this.selectedRegistration).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only crop
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.districtCropAreNotNull(this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only grade
      if(this.selectedRegion == null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade != null) {
          this.def.districtCropGradeAreNotNull(this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }
      //==========end inclusion of only one==========//

    }

    // filter all
    if(this.selectedDistrict != null){
      // there is no need to include this.selectedDistrict since it is not null here, it will/must included in service functions parameters
      // All combinations
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade != null) {
          this.def.filterByAllCombinations(this.selectedRegion, this.selectedDistrict, this.selectedOwnership, this.selectedRegistration, this.selectedCrop, this.selectedCropGrade).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      //==========One is excluded==========//
      // only selectedCropGrade is null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade == null) {
          this.def.filterWithExceptionOfDistrictAndCropGrade(this.selectedRegion, this.selectedOwnership, this.selectedRegistration, this.selectedCrop).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // only crop is null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade != null) {

      }

      // only registration is null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade != null) {

      }

      // only ownership is null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade != null) {

      }
      //==========end exclusion of one==========//

      //==========two are excluded==========//
      // crop and grade are null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.filterByOnlyRegionDistrictAndOwnershipRegistration(this.selectedRegion, this.selectedDistrict, this.selectedOwnership, this.selectedRegistration).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // registration and grade are null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade == null) {

      }

      // ownership and grade are null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop != null && this.selectedCropGrade == null) {

      }

      // registration and crop are null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade != null) {

      }

      // ownership and crop are null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade != null) {

      }

      // ownership and registration are null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade != null) {

      }
      //==========end exclusion of two==========//

      //==========three are excluded==========//
      // region and ownership are not null
      if(this.selectedRegion != null && this.selectedOwnership != null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.filterByOnlyRegionDistrictAndOwnership(this.selectedRegion, this.selectedDistrict, this.selectedOwnership).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }

      // region and registration are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration != null
        && this.selectedCrop == null && this.selectedCropGrade == null) {

      }

      // region and crop are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop != null && this.selectedCropGrade == null) {

      }

      // region and grade are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade != null) {

      }

      //==========end exclusion of three==========//

      //==========only one is not null==========//
      // region and district are not null
      if(this.selectedRegion != null && this.selectedOwnership == null && this.selectedRegistration == null
        && this.selectedCrop == null && this.selectedCropGrade == null) {
          this.def.filterByOnlyRegionAndDistrict(this.selectedDistrict).subscribe(
            data => {
              this.updateValues(data);
            }
          );
      }
      //==========end inclusion of only one==========//

    }
  }

  updateValues(data) {
    this.stcaps = data[0];
    this.ownership = data[1];
    this.cropcap = data[2];
    this.warecropcap = data[3];
    this.utilization = data[4];
    this.cropsLocation = data[5]

    this.drawFilteredGraphs();
  }
}

function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
