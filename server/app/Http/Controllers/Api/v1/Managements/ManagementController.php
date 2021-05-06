<?php

namespace App\Http\Controllers\Api\v1\Managements;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class ManagementController extends Controller
{
    public function index() {
        $warehouses = Warehouse::join('regions', 'regions.id', '=', 'warehouses.region_id')
                                    ->join('districts', 'districts.id', '=', 'warehouses.district_id')
                                    ->select('districts.name as district', 'regions.name as region', 'warehouses.*')
                                    ->get();

        return response()->json($warehouses);
    }

    public function store(Request $request) {
        $warehouse = new Warehouse;
        $warehouse->name = $request->input('name');
        $warehouse->type = $request->input('type');
        $warehouse->licensed_by = $request->input('licensed_by');
        $warehouse->capacity = $request->input('capacity');
        $warehouse->grade = $request->input('grade');
        $warehouse->region_id = $request->input('regionId');
        $warehouse->district_id = $request->input('districtId');

        $warehouse->save();

        return response()->json('Data added successfully');
    }


    public function show($id) {
        $warehouse = Warehouse::join('regions', 'regions.id', '=', 'warehouses.region_id')
                                ->join('districts', 'districts.id', '=', 'warehouses.district_id')
                                ->select('regions.name as region', 'districts.name as district', 'warehouses.*')
                                ->where('warehouses.id', $id)->first();
        return response()->json($warehouse);
    }

    public function update(Request $request, $id) {
        $warehouse = Warehouse::find($id);

        $warehouse->name = $request->input('name');
        $warehouse->type = $request->input('type');
        $warehouse->licensed_by = $request->input('licensed_by');
        $warehouse->capacity = $request->input('capacity');
        $warehouse->grade = $request->input('grade');
        $warehouse->region_id = $request->input('regionId');
        $warehouse->district_id = $request->input('districtId');

        $warehouse->save();

        return response()->json('Warehouse updated successfully');
    }

    public function delete($id) {
        Warehouse::find($id)->delete();

        return response()->json('Warehouse deleted successfully');

    }
}
