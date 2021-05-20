<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegionOwnershipRegistrationFilterController extends Controller
{
    public function regionOwnershipRegistrationFilter($regionId, $ownership, $registration) {
        $grade = $this->storageByGrade($regionId, $ownership, $registration);
        $ownershipData = $this->storageByOwnership($regionId, $ownership, $registration);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($regionId, $ownership, $registration);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($regionId, $ownership, $registration);
        $utilization = $this->warehouseUtilization($regionId, $ownership, $registration);
        $cropsLocation = $this->getCropsByLocation($regionId, $ownership, $registration);

        $collection = collect([]);
        $collection->push($grade, $ownershipData, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($regionId, $ownership, $registration) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouses = Warehouse::where('region_id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                    ->select(DB::raw('SUM(capacity) as capacity'), 'grade')->groupBy('grade')->get();
        }else{
            $warehouses = Warehouse::where('region_id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                    ->select(DB::raw('SUM(capacity) as capacity'), 'grade')->groupBy('grade')->get();
        }

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($regionId, $ownership, $registration) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouses = Warehouse::where('region_id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                    ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();
        }else {
            $warehouses = Warehouse::where('region_id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                    ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();
        }

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($regionId, $ownership, $registration) {
        // return $ownership;
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouseCapacity = Warehouse::where('region_id', $regionId)
                                            ->where('type', $ownership)->whereNotNull('licensed_by')
                                            ->sum('capacity');

            $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                        ->where('warehouses.region_id', $regionId)
                                        ->where('type', $ownership)->whereNotNull('licensed_by')
                                        ->sum('amount');
        }else {
            $warehouseCapacity = Warehouse::where('region_id', $regionId)
                                            ->where('type', $ownership)->whereNull('licensed_by')
                                            ->sum('capacity');

            $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                        ->where('warehouses.region_id', $regionId)
                                        ->where('type', $ownership)->whereNull('licensed_by')
                                        ->sum('amount');
        }

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($regionId, $ownership, $registration) {

        $crops = collect([]);
        $regions = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        if($registration == 'yes') {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                                ->groupBy('regions.name')
                                ->get();
        }else {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                                ->groupBy('regions.name')
                                ->get();
        }

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
    public function warehouseUtilization($regionId, $ownership, $registration) {
        $collection = collect([]);
        // crops stored
        if($registration == 'yes') {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('regions.name')
                            ->orderBy('amount')
                            ->get();
        }else {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('regions.name')
                            ->orderBy('amount')
                            ->get();
        }

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
    public function getCropsByLocation($regionId, $ownership, $registration) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                                ->groupBy('regions.name')
                                ->get();
        }else {
            $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                                ->groupBy('regions.name')
                                ->get();
        }

        foreach($stocks as $stock) {
            $regions->push($stock->name);
            $values->push($stock->amount);
        }
        $collection->push($regions, $values);
        return $collection;
    }
}
