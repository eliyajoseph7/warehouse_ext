<?php

namespace App\Http\Controllers\Api\v1\RegionDistrict;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Region;
use App\Models\StockMovement;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class RegionDistrictController extends Controller
{
    public function getAllRegions() {
        $regions = Region::orderBy('name')->get();
        return response()->json($regions);
    }

    public function getRegionsAvailableInStockTaking() {
        $regions = Region::join('districts', 'regions.id', '=', 'districts.region_id')
                        ->join('stock_takings', 'stock_takings.district_id', '=', 'districts.id')
                        ->select('regions.id', 'regions.name')
                        ->distinct('regions.name')
                        ->orderBy('name')->get();
        return response()->json($regions);
    }

    public function getDistrictsAvailableInStockTaking($regionId) {
        $districts = District::join('stock_takings', 'stock_takings.district_id', '=', 'districts.id')
                        ->select('districts.id', 'districts.name')
                        ->distinct('districts.name')
                        ->where('region_id', $regionId)
                        ->orderBy('name')->get();
        return response()->json($districts);
    }

    public function getDistricts($regionId) {
        $districts = District::orderBy('name')->where('region_id', $regionId)->get();
        return response()->json($districts);
    }


    public function getRegionsAvailableInStockMovement() {
        $regions = Region::join('districts', 'regions.id', '=', 'districts.region_id')
                            ->join('stock_movements', 'stock_movements.from', '=', 'districts.id')
                            ->select('regions.id', 'regions.name')
                            ->where('stock_movements.status', '1')
                            ->orderBy('regions.name')
                            ->get();
        return response()->json($regions);
    }

    public function getdistrictsAvailableInStockMovement($regionId) {
        $districts = District::join('stock_movements', 'stock_movements.from', '=', 'districts.id')
                            ->select('districts.id', 'districts.name', 'stock_movements.amount')
                            ->where('districts.region_id', $regionId)
                            ->where('stock_movements.status', '1')
                            ->orderBy('districts.name')
                            ->get();
        return response()->json($districts);
    }

    // getting all crops transfered from a certain district
    public function transferedCropsByDistrict($districtId) {
        $crops = StockMovement::join('crops', 'stock_movements.crop_id', '=', 'crops.id')
                                ->where('from', $districtId)
                                ->where('status', '1')
                                ->select('crops.id', 'crops.name')
                                ->get();
        $warehouses = StockMovement::join('warehouses', 'warehouses.district_id', '=', 'stock_movements.to')
                                    ->where('from', $districtId)->where('status', '1')
                                    ->select('warehouses.*')
                                    ->get();
        // $warehouses = Warehouse::where('district_id', $districtId)->get();
        if($warehouses->count() == 0) {
            $warehouses = "no warehouse";
        }
        $collection = collect([]);

        $collection->push($crops, $warehouses);
        return response()->json($collection);
    }

    // getting the transfered amount
    public function amountToBeReceived($districtId, $cropId) {
        $value = StockMovement::where('from', $districtId)->where('crop_id', $cropId)->where('status', '1')->sum('amount');

        return response()->json($value);
    }
}
