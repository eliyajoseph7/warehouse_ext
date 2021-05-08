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
    $warehouses = Warehouse::select(DB::raw('COUNT(capacity) as capacity'), 'type')->groupBy('type')->get();

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

        $collection = collect([]);
        // crops stored
        $crops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->select('regions.name', DB::Raw("SUM(amount) as amount"))
                            ->groupBy('regions.name')
                            ->get();

        $crops2 = GoodsReception::join('districts', 'districts.id', '=', 'goods_receptions.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->select('regions.name', DB::raw("SUM(quantity) as quantity"))
                            ->groupBy('regions.name')
                            ->get();
        $cropsCombine = [];

        foreach($crops as $crop) {
            foreach($crops2 as $crop2) {
                if($crop->name == $crop2->name) {
                    $cropsCombine[] = [
                        'name' => $crop->name,
                        'amount' => $crop->amount + $crop2->quantity
                    ];
                }
            }
        }

        $temp = collect([]);
        foreach($cropsCombine as $combine) {
            $temp->push($combine);
        }

        foreach($crops as $crop) {
            if($temp->where('name', $crop->name)->count() > 0){
            }else{
                $temp->push($crop);
            }
        }

        // warehouse capacity
        $warehouse = Warehouse::join('regions', 'regions.id', '=', 'warehouses.region_id')
                                ->select('regions.name', DB::raw('SUM(capacity) as capacity'))
                                ->groupBy('regions.name')
                                ->get();

        $regions = collect([]);
        $cropData = collect([]);
        $warehouseData = collect([]);

        // available in both $temp and $warehouse
        foreach($temp as $tem) {
            foreach($warehouse as $ware) {
                if($tem['name'] === $ware->name) {
                    $regions->push($tem['name']);
                    $cropData->push((int)$tem['amount']);
                    $warehouseData->push((int)$ware->capacity);
                }
            }
        }

        // only available in $temp
        foreach($temp as $tem) {
            if(!$regions->contains($tem['name'])) {
                $regions->push($tem['name']);
                $cropData->push((int)$tem['amount']);
                $warehouseData->push(0);
            }
        }

        // only available in $warehouse
        foreach($warehouse as $ware) {
            if(!$regions->contains($ware->name)) {
                $regions->push($ware->name);
                $cropData->push(0);
                $warehouseData->push((int)$ware->capacity);
            }
        }

        // pushing all data to a single collection
        $collection->push($regions, $cropData, $warehouseData);
        return $collection;
   }


    // warehouse utilization
    public function warehouseUtilization() {
        $collection = collect([]);
        // crops stored
        $crops = StockTaking::join('districts', 'districts.id', '=', 'stock_takings.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->select('regions.name', DB::Raw("sum(amount) as amount"))
                            ->groupBy('regions.name')
                            ->get();

        $crops2 = GoodsReception::join('districts', 'districts.id', '=', 'goods_receptions.district_id')
                            ->join('regions', 'regions.id', '=', 'districts.region_id')
                            ->select('regions.name', DB::Raw('SUM(quantity) as quantity'))
                            ->groupBy('regions.name')
                            ->get();
        $cropsCombine = [];

        foreach($crops as $crop) {
            foreach($crops2 as $crop2) {
                if($crop->name == $crop2->name) {
                    $cropsCombine[] = [
                        'name' => $crop->name,
                        'amount' => $crop->amount + $crop2->quantity
                    ];
                }
            }
        }

        $temp = collect([]);
        foreach($cropsCombine as $combine) {
            $temp->push($combine);
        }

        foreach($crops as $crop) {
            if($temp->where('name', $crop->name)->count() > 0){
            }else{
                $temp->push($crop);
            }
        }

        // return $temp;
        // warehouse capacity
        $warehouse = Warehouse::join('regions', 'regions.id', '=', 'warehouses.region_id')
                                ->select('regions.name', DB::Raw('SUM(capacity) as capacity'))
                                ->groupBy('regions.name')
                                ->get();

        $regions = collect([]);
        $warehouseData = collect([]);
        // available in both $temp and $warehouse
        foreach($temp as $tem) {
            foreach($warehouse as $ware) {
                if($tem['name'] === $ware->name) {
                    $regions->push($tem['name']);
                    $warehouseData->push($this->calculateUtilization((int)$tem['amount'],(int)$ware->capacity));
                }
            }
        }

        // only available in $temp
        foreach($temp as $tem) {
            if(!$regions->contains($tem['name'])) {
                $regions->push($tem['name']);
                $warehouseData->push(0);
            }
        }

        // only available in $warehouse
        foreach($warehouse as $ware) {
            if(!$regions->contains($ware->name)) {
                $regions->push($ware->name);
                $warehouseData->push($this->calculateUtilization(0, (int)$ware->capacity));
            }
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
}
