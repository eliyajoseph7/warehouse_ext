<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class RegistrationIsNullController extends Controller
{
    public function filterWithoutRegistration($regionId, $ownership, $crop, $grade) {
        $gradeData = $this->storageByGrade($regionId, $ownership, $crop, $grade);
        $ownershipData = $this->storageByOwnership($regionId, $ownership, $crop, $grade);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($regionId, $ownership, $crop, $grade);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($regionId, $ownership, $crop, $grade);
        $utilization = $this->warehouseUtilization($regionId, $ownership, $crop, $grade);
        $cropsLocation = $this->getCropsByLocation($regionId, $ownership, $crop, $grade);

        $collection = collect([]);
        $collection->push($gradeData, $ownershipData, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($regionId, $ownership, $crop, $grade) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                ->where('region_id', $regionId)->where('type', $ownership)
                                ->select(DB::raw('SUM(capacity) as capacity'), 'warehouses.grade')->groupBy('warehouses.grade')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($regionId, $ownership, $crop, $grade) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                ->where('region_id', $regionId)->where('type', $ownership)
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($regionId, $ownership, $crop, $grade) {
        // return $ownership;
        $collection = collect([]);
        $warehouseCapacity = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                        ->where('region_id', $regionId)->where('crop_id', $crop)
                                        ->where('type', $ownership)
                                        ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->where('crops.grade', $grade)
                                        ->sum('capacity');

        $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                    ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                    ->where('warehouses.region_id', $regionId)->where('crop_id', $crop)
                                    ->where('type', $ownership)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                    ->where('crops.grade', $grade)
                                    ->sum('amount');

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($regionId, $ownership, $crop, $grade) {

        $crops = collect([]);
        $regions = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)
                            ->where('crop_id', $crop)
                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                            ->where('crops.grade', $grade)
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
    public function warehouseUtilization($regionId, $ownership, $crop, $grade) {
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                        ->join('regions', 'regions.id', '=', 'districts.region_id')
                        ->where('regions.id', $regionId)->where('type', $ownership)
                        ->where('crop_id', $crop)
                        ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                        ->where('crops.grade', $grade)
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
    public function getCropsByLocation($regionId, $ownership, $crop, $grade) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                            ->where('crop_id', $crop)
                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                            ->where('crops.grade', $grade)
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
