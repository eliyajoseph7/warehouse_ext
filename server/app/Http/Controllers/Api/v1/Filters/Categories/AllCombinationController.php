<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class AllCombinationController extends Controller
{
    public function filterAll($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        $gradeData = $this->storageByGrade($regionId, $districtId, $ownership, $registration, $crop, $grade);
        $ownershipData = $this->storageByOwnership($regionId, $districtId, $ownership, $registration, $crop, $grade);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($regionId, $districtId, $ownership, $registration, $crop, $grade);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($regionId, $districtId, $ownership, $registration, $crop, $grade);
        $utilization = $this->warehouseUtilization($regionId, $districtId, $ownership, $registration, $crop, $grade);
        $cropsLocation = $this->getCropsByLocation($regionId, $districtId, $ownership, $registration, $crop, $grade);

        $collection = collect([]);
        $collection->push($gradeData, $ownershipData, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                    ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                                    ->where('region_id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                    ->select(DB::raw('SUM(capacity) as capacity'), 'warehouses.grade')->groupBy('warehouses.grade')->get();
        }else{
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->where('region_id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                    ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                                    ->select(DB::raw('SUM(capacity) as capacity'), 'warehouses.grade')->groupBy('warehouses.grade')->get();
        }

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->where('region_id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                    ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                                    ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();
        }else {
            $warehouses = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                    ->where('region_id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                    ->where('crop_id', $crop)
                                    ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                    ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                                    ->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();
        }

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        // return $ownership;
        $collection = collect([]);
        if($registration == 'yes') {
            $warehouseCapacity = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                            ->where('region_id', $regionId)->where('crop_id', $crop)->where('warehouses.district_id', $districtId)
                                            ->where('type', $ownership)->whereNotNull('licensed_by')
                                            ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                            ->where('crops.grade', $grade)
                                            ->sum('capacity');

            $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                        ->where('warehouses.region_id', $regionId)->where('crop_id', $crop)
                                        ->where('type', $ownership)->whereNotNull('licensed_by')
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                        ->where('warehouses.district_id', $districtId)
                                        ->sum('amount');
        }else {
            $warehouseCapacity = Warehouse::join('stock_takings', 'stock_takings.warehouse_id', '=', 'warehouses.id')
                                            ->where('region_id', $regionId)->where('crop_id', $crop)
                                            ->where('warehouses.district_id', $districtId)
                                            ->where('type', $ownership)->whereNull('licensed_by')
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                            ->sum('capacity');

            $storedCrops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                        ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                        ->where('warehouses.region_id', $regionId)->where('crop_id', $crop)
                                        ->where('warehouses.district_id', $districtId)
                                        ->where('type', $ownership)->whereNull('licensed_by')
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                        ->sum('amount');
        }

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($regionId, $districtId, $ownership, $registration, $crop, $grade) {

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
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                                ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                                ->groupBy('districts.name')
                                ->get();
        }else {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                                ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                                ->groupBy('districts.name')
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
    public function warehouseUtilization($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        $collection = collect([]);
        // crops stored
        if($registration == 'yes') {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                            ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('districts.name')
                            ->orderBy('amount')
                            ->get();
        }else {
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->where('regions.id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)->where('warehouses.district_id', $districtId)
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('districts.name')
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
    public function getCropsByLocation($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        if($registration == 'yes') {
            $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNotNull('licensed_by')
                                ->select('districts.name', DB::Raw("SUM(amount) as amount"))
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                ->where('warehouses.district_id', $districtId)
                                ->groupBy('districts.name')
                                ->get();
        }else {
            $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                                ->join('regions', 'regions.id', '=', 'districts.region_id')
                                ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                                ->where('regions.id', $regionId)->where('type', $ownership)->whereNull('licensed_by')
                                ->select('districts.name', DB::Raw("SUM(amount) as amount"))
                                ->where('crop_id', $crop)
                                ->join('crops', 'stock_takings.crop_id', '=', 'crops.id')
                                ->where('crops.grade', $grade)
                                ->where('warehouses.district_id', $districtId)
                                ->groupBy('districts.name')
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
