<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class RegionAndCropController extends Controller
{
    public function filterWithRegionAndCrop($regionId, $crop) {
        $gradeData = $this->storageByGrade($regionId, $crop);
        $ownershipData = $this->storageByOwnership($regionId, $crop);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($regionId, $crop);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($regionId, $crop);
        $utilization = $this->warehouseUtilization($regionId, $crop);
        $cropsLocation = $this->getCropsByLocation($regionId, $crop);

        $collection = collect([]);
        $collection->push($gradeData, $ownershipData, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($regionId, $crop) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                ->where('crop_id', $crop)
                                ->where('region_id', $regionId)
                                ->select(DB::raw('SUM(capacity) as capacity'), 'grade')->groupBy('grade')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($regionId, $crop) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                ->where('region_id', $regionId)
                                ->where('crop_id', $crop)
                                ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($regionId, $crop) {
        // return $ownership;
        $collection = collect([]);
        $warehouseCapacity = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                        ->where('region_id', $regionId)->where('crop_id', $crop)
                                        ->sum('capacity');

        $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                    ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                    ->where('warehouses.region_id', $regionId)->where('crop_id', $crop)
                                    ->sum('amount');

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($regionId, $crop) {

        $crops = collect([]);
        $regions = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('regions.id', $regionId)
                            ->where('crop_id', $crop)
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('regions.name')
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
    public function warehouseUtilization($regionId, $crop) {
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                        ->join('regions', 'regions.id', '=', 'districts.region_id')
                        ->where('regions.id', $regionId)
                        ->where('crop_id', $crop)
                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                        ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                        ->groupBy('regions.name')
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
    public function getCropsByLocation($regionId, $crop) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('regions.id', $regionId)
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                            ->where('crop_id', $crop)
                            ->groupBy('regions.name')
                            ->get();

        foreach($stocks as $stock) {
            $regions->push($stock->name);
            $values->push($stock->amount);
        }
        $collection->push($regions, $values);
        return $collection;
    }
}
