<?php

namespace App\Http\Controllers\Api\v1\Markets;

use App\Http\Controllers\Controller;
use App\Models\Market;
use Illuminate\Http\Request;

class MarketController extends Controller
{
    public function index() {
        $markets = Market::with('region')->with('district')->get();

        return response()->json($markets);
    }

    public function store(Request $request) {
        $market = new Market;

        $market->name = $request->input('name');
        $market->type = $request->input('type');
        $market->region_id = $request->input('regionId');
        $market->district_id = $request->input('districtId');

        $market->save();
        return response()->json('Market added successfully');
    }

    public function show($id) {
        $market = Market::find($id);

        return response()->json($market);
    }

    public function update($id, Request $request) {
        $market = Market::find($id);

        $market->name = $request->input('name');
        $market->type = $request->input('type');
        $market->region_id = $request->input('regionId');
        $market->district_id = $request->input('districtId');

        $market->save();
        return response()->json('Market updated successfully');
    }

    public function delete($id) {
        Market::find($id)->delete();

        return response()->json('Market deleted successfully');
    }
}
