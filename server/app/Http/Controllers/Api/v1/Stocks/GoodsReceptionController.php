<?php

namespace App\Http\Controllers\Api\v1\Stocks;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use App\Models\StockTaking;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class GoodsReceptionController extends Controller
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
                            ->join('districts', 'districts.id', 'stock_takings.origin')
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
        $moved = StockMovement::where('from', $request->input('origin'))->where('crop_id', $request->input('crop_id'))->first();
        $availableDestination = StockTaking::where('district_id', $moved->to)->where('crop_id', $moved->crop_id)->first();

        if($availableDestination != null) {
            return $availableDestination;
            $availableDestination->origin = $request->input('origin');
            $availableDestination->price = $request->input('price');
            $availableDestination->received_amount = $request->input('quantity');
            $availableDestination->received_date = date('Y-m-d',strtotime($request->input('date')));
            $availableDestination->amount += $request->input('quantity');

            $availableDestination->save();
            $moved->status  = 0;
            $moved->save();
        }
        else {
            $goods = new StockTaking;
            $goods->date = date('Y-m-d',strtotime($request->input('date')));
            $goods->warehouse_id = $request->input('warehouse_id');
            $goods->crop_id = $request->input('crop_id');
            $goods->district_id = $moved->to;
            $goods->amount = $request->input('quantity');
            $goods->received_date = date('Y-m-d',strtotime($request->input('date')));
            $goods->price = $request->input('price');
            $goods->origin = $request->input('origin');
            $goods->received_amount = $request->input('quantity');

            $goods->save();
            $moved->status  = 0;
            $moved->save();
        }

        return response()->json('Goods received successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
