<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegionDistrictOwnershipController extends Controller
{
    public function filterRegionDistrictOwnership($regionId, $districtId, $ownership) {
        $grade = $this->storageByGrade($regionId, $districtId, $ownership);
        $ownershipData = $this->storageByOwnership($regionId, $districtId, $ownership);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($regionId, $districtId, $ownership);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($regionId, $districtId, $ownership);
        $utilization = $this->warehouseUtilization($regionId, $districtId, $ownership);
        $cropsLocation = $this->getCropsByLocation($regionId, $districtId, $ownership);

        $collection = collect([]);
        $collection->push($grade, $ownershipData, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($regionId, $districtId, $ownership) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::where('region_id', $regionId)->where('type', $ownership)->where('district_id', $districtId)
                                ->select(DB::raw('SUM(capacity) as capacity'), 'grade')->groupBy('grade')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($regionId, $districtId, $ownership) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::where('region_id', $regionId)->where('type', $ownership)->where('district_id', $districtId)
                                ->select(DB::raw('COUNT(capacity) as capacity'), 'type')->groupBy('type')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($regionId, $districtId, $ownership) {
        // return $ownership;
        $collection = collect([]);
        $warehouseCapacity = Warehouse::where('region_id', $regionId)->where('district_id', $districtId)
                                        ->where('type', $ownership)
                                        ->sum('capacity');

        $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                    ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                    ->where('warehouses.region_id', $regionId)->where('warehouses.district_id', $districtId)
                                    ->where('type', $ownership)
                                    ->sum('amount');

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($regionId, $districtId, $ownership) {

        $crops = collect([]);
        $regions = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)->where('warehouses.district_id', $districtId)
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('districts.name')
                            ->get();

        foreach($data as $data) {
            $regions->push($data->name);
            $crops->push($data->amount);
            $warehouses->push($data->capacity);
        }
        // pushing all data to a single collection
        $collection->push($regions, $crops, $warehouses);

        return $collection;
    }


    // warehouse utilization
    public function warehouseUtilization($regionId, $districtId, $ownership) {
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                        ->join('regions', 'regions.id', '=', 'districts.region_id')
                        ->where('regions.id', $regionId)->where('type', $ownership)
                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                        ->where('warehouses.district_id', $districtId)
                        ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                        ->groupBy('districts.name')
                        ->orderBy('amount')
                        ->get();

        $regions = collect([]);
        $warehouseData = collect([]);

        foreach($data as $data) {
            $regions->push($data->name);
            $warehouseData->push($this->calculateUtilization($data->amount, $data->capacity));
        }


        $collection->push($regions, $warehouseData);
        return $collection;
    }

    public function calculateUtilization($available, $billed) {
        $utilization = (($billed - $available) / $billed) * 100;

        if($utilization != "100") {
            $utilization = (float)number_format($utilization, 2, '.', '');
        }
        return $utilization;
    }

    // Stored crops by location
    public function getCropsByLocation($regionId, $districtId, $ownership) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)
                            ->where('warehouses.district_id', $districtId)
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"))
                            ->groupBy('districts.name')
                            ->get();

        foreach($stocks as $stock) {
            $regions->push($stock->name);
            $values->push($stock->amount);
        }
        $collection->push($regions, $values);
        return $collection;
    }
}
