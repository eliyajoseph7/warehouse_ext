<?php

namespace App\Http\Controllers\Api\v1\Charts;

use App\Http\Controllers\Controller;
use App\Models\GoodsReception;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DrawChartController extends Controller
{
   public function storageByGrade() {
    $category = collect([]);
    $capacity = collect([]);
    $collection = collect([]);
    $warehouses = Warehouse::select(DB::raw('SUM(capacity) as capacity'), 'grade')->groupBy('grade')->get();

    foreach($warehouses as $warehouse) {
        $category->push($warehouse->grade);
        $capacity->push($warehouse->capacity);
    }

    $collection->push($category, $capacity);
    return response()->json($collection);
   }

   public function storageByOwnership() {
    $category = collect([]);
    $capacity = collect([]);
    $collection = collect([]);
    $warehouses = Warehouse::select(DB::raw('COUNT(DISTINCT(warehouses.name)) as capacity'), 'type')->groupBy('type')->get();

    foreach($warehouses as $warehouse) {
        $category->push($warehouse->type);
        $capacity->push($warehouse->capacity);
    }

    $collection->push($category, $capacity);
    return response()->json($collection);
   }

   public function storedCropAndCapacity() {
       $collection = collect([]);
       $warehouseCapacity = Warehouse::all()->sum('capacity');

       $storedCrops = StockTaking::all()->sum('amount');

       $collection->push([$storedCrops], [$warehouseCapacity]);
       return response()->json($collection);
   }

   public function warehouseCapacityAndCrops() {

        $crops = collect([]);
        $regions = collect([]);
        $warehouses = collect([]);
        $collection = collect([]);
        // crops stored
        $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->join('warehouses', 'warehouses.id', '=', 'stock_takings.warehouse_id')
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

        return response()->json($collection);
   }


    // warehouse utilization
    public function warehouseUtilization() {
        $collection = collect([]);
        // crops stored
         $data = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
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
        return response()->json($collection);
    }

    public function calculateUtilization($available, $billed) {
        $utilization = (($billed - $available) / $billed) * 100;

        if($utilization != "100") {
            $utilization = (float)number_format($utilization, 2, '.', '');
        }
        return $utilization;
    }

    // this function is used when drilling down the warehouse ownership chart to see the registration
    public function warehouseOwnershipRegistration($type) {
        $collection = collect([]);
        $yes = Warehouse::whereRaw('lower(type) = ?', strtolower($type))->whereNotNull('licensed_by')->count();
        $no = Warehouse::whereRaw('lower(type) = ?', strtolower($type))->whereNull('licensed_by')->count();

        $collection->push(['Yes', 'No'], [$yes, $no]);
        return response()->json($collection);
    }

    // Stored crops by location
    public function getCropsByLocation() {
        // the data can be obtained from stock_takings table and goods_receptions table
        $regions = collect([]);
        $values = collect([]);
        $collection = collect([]);
        $stocks = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                            ->groupBy('regions.name')
                            ->get();

        foreach($stocks as $stock) {
            $regions->push($stock->name);
            $values->push($stock->amount);
        }
        $collection->push($regions, $values);
        return response()->json($collection);
    }
}
