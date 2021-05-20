<?php

namespace App\Http\Controllers\Api\v1\Filters\Categories;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class RegionAndDistrictFilterController extends Controller
{
    public function regionDistrictFilter($distictId) {
        $grade = $this->storageByGrade($distictId);
        $ownership = $this->storageByOwnership($distictId);
        $cropStoredAndCapacity = $this->storedCropAndCapacity($distictId);
        $warehouseCapacityAndCrops = $this->warehouseCapacityAndCrops($distictId);
        $utilization = $this->warehouseUtilization($distictId);
        $cropsLocation = $this->getCropsByLocation($distictId);

        $collection = collect([]);
        $collection->push($grade, $ownership, $cropStoredAndCapacity, $warehouseCapacityAndCrops, $utilization, $cropsLocation);

        return $collection;

    }
    public function storageByGrade($distictId) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::where('district_id', $distictId)->select(DB::raw('SUM(capacity) as capacity'), 'grade')->groupBy('grade')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->grade);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storageByOwnership($distictId) {
        $category = collect([]);
        $capacity = collect([]);
        $collection = collect([]);
        $warehouses = Warehouse::where('district_id', $distictId)->select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();

        foreach($warehouses as $warehouse) {
            $category->push($warehouse->type);
            $capacity->push($warehouse->capacity);
        }

        $collection->push($category, $capacity);
        return $collection;
    }

    public function storedCropAndCapacity($distictId) {
        $collection = collect([]);
        $warehouseCapacity = Warehouse::where('district_id', $distictId)->sum('capacity');

        $storedCrops = StockTaking::where('district_id', $distictId)->sum('amount');

        $collection->push([$storedCrops], [$warehouseCapacity]);
        return $collection;
    }

    public function warehouseCapacityAndCrops($distictId) {

        $crops = collect([]);
        $labels = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->where('districts.id', $distictId)
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('districts.name')
                            ->get();

        foreach($data as $data) {
            $labels->push($data->name);
            $crops->push($data->amount);
            $warehouses->push($data->capacity);
        }
        // pushing all data to a single collection
        $collection->push($labels, $crops, $warehouses);

        return $collection;
    }


    // warehouse utilization
    public function warehouseUtilization($distictId) {
        $collection = collect([]);
        // crops stored
            $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->where('districts.id', $distictId)
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"), DB::Raw('SUM(warehouses.capacity) as capacity'))
                            ->groupBy('districts.name')
                            ->orderBy('amount')
                            ->get();

        $labels = collect([]);
        $warehouseData = collect([]);

        foreach($data as $data) {
            $labels->push($data->name);
            $warehouseData->push($this->calculateUtilization($data->amount, $data->capacity));
        }


        $collection->push($labels, $warehouseData);
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
    public function getCropsByLocation($distictId) {
        // the data can be obtained from stock_takings table and goods_receptions table
        $labels = collect([]);
        $values = collect([]);
        $collection = collect([]);
        $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->where('districts.id', $distictId)
                            ->select('districts.name', DB::Raw("SUM(amount) as amount"))
                            ->groupBy('districts.name')
                            ->get();

        foreach($stocks as $stock) {
            $labels->push($stock->name);
            $values->push($stock->amount);
        }
        $collection->push($labels, $values);
        return $collection;
    }
}
