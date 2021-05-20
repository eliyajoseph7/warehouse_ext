<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class RegistrationAndCropController extends Controller
{
    public function filterWithRegistrationAndCrop($registration, $crop) {
        $gradeData = $this->storageByGrade($registration, $crop);
        $ownershipData = $this->storageByOwnership($registration, $crop);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($registration, $crop);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($registration, $crop);
        $utilization = $this->warehouseUtilization($registration, $crop);
        $cropsLocation = $this->getCropsByLocation($registration, $crop);

        $collection = collect([]);
        $collection->push($gradeData, $ownershipData, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($registration, $crop) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->whereNotNull('licensed_by')
                                    ->select(DB::raw('SUM(capacity) as capacity'), 'warehouses.grade')->groupBy('warehouses.grade')->get();
        }else{
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->whereNull('licensed_by')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->select(DB::raw('SUM(capacity) as capacity'), 'warehouses.grade')->groupBy('warehouses.grade')->get();
        }

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($registration, $crop) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->whereNotNull('licensed_by')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();
        }else {
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->whereNull('licensed_by')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();
        }

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($registration, $crop) {
        // return $ownership;
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouseCapacity = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                            ->where('crop_id', $crop)
                                            ->whereNotNull('licensed_by')
                                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                            ->sum('capacity');

            $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                        ->where('crop_id', $crop)
                                        ->whereNotNull('licensed_by')
                                        ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->sum('amount');
        }else {
            $warehouseCapacity = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                            ->where('crop_id', $crop)
                                            ->whereNull('licensed_by')
                                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                            ->sum('capacity');

            $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                        ->where('crop_id', $crop)
                                        ->whereNull('licensed_by')
                                        ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                        ->sum('amount');
        }

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($registration, $crop) {

        $crops = collect([]);
        $regions = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        if($registration == 'yes') {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->whereNotNull('licensed_by')
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                                ->groupBy('regions.name')
                                ->get();
        }else {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->whereNull('licensed_by')
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
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
    public function warehouseUtilization($registration, $crop) {
        $collection = collect([]);
        // crops stored
        if($registration == 'yes') {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->whereNotNull('licensed_by')
                            ->where('crop_id', $crop)
                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('regions.name')
                            ->orderBy('amount')
                            ->get();
        }else {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->whereNull('licensed_by')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('crop_id', $crop)
                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
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
    public function getCropsByLocation($registration, $crop) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->whereNotNull('licensed_by')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->groupBy('regions.name')
                                ->get();
        }else {
            $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->whereNull('licensed_by')
                                ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
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
