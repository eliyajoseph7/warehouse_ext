<?php

namespace App\Http\Controllers\Api\v1\RegionDistrict;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionDistrictController extends Controller
{
    public function getAllRegions() {
        $regions = Region::orderBy('name')->get();
        return response()->json($regions);
    }

    public function getDistricts($regionId) {
        $districts = District::orderBy('name')->where('region_id', $regionId)->get();
        return response()->json($districts);
    }
}
