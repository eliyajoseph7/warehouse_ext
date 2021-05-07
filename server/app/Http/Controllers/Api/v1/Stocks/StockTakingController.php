<?php

namespace App\Http\Controllers\Api\v1\Stocks;

use App\Http\Controllers\Controller;
use App\Models\StockTaking;
use Illuminate\Http\Request;

class StockTakingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       $stock = StockTaking::join('warehouses', 'warehouses.id', 'stock_takings.warehouse_id')
                            ->join('crops', 'crops.id', 'stock_takings.crop_id')
                            ->join('districts', 'districts.id', 'stock_takings.district_id')
                            ->select('warehouses.name as warehouse', 'crops.name as crop', 'districts.name as district', 'districts.region_id', 'stock_takings.*')
                            ->get();

       return response()->json($stock);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $stock = new StockTaking;
        $stock->date = date('Y-m-d',strtotime($request->input('date')));
        $stock->warehouse_id = $request->input('warehouse_id');
        $stock->crop_id = $request->input('crop_id');
        $stock->district_id = $request->input('district_id');
        $stock->amount = $request->input('amount');

        $stock->save();

        return response()->json('Stock taken successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $stock = StockTaking::find($id);

        return response()->json($stock);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $stock = StockTaking::find($id);
        $stock->date = date('Y-m-d',strtotime($request->input('date')));
        $stock->warehouse_id = $request->input('warehouse_id');
        $stock->crop_id = $request->input('crop_id');
        $stock->district_id = $request->input('district_id');
        $stock->amount = $request->input('amount');

        $stock->save();

        return response()->json('Stock updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        StockTaking::find($id)->delete();
        return response()->json('Stock deleted successfully');
    }
}
