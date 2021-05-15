<?php

namespace App\Http\Controllers\Api\v1\Stocks;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\StockMovement;
use App\Models\StockTaking;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $stocks = StockMovement::join('crops', 'crops.id', 'stock_movements.crop_id')
                            ->select('crops.name as crop', 'stock_movements.*')
                            ->with('from')
                            ->with('to')
                            ->where('status', '1')
                            ->get();

        // return $stocks;
        return response()->json($stocks);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $available_amount = StockTaking::where('district_id', $request->input('from'))->first();
        if($available_amount->amount > $request->input('amount')) {
            $stock = new StockMovement;
            $stock->trader_name = $request->input('trader_name');
            $stock->from = $request->input('from');
            $stock->to = $request->input('to');
            $stock->crop_id = $request->input('crop_id');
            $stock->amount = $request->input('amount');
            $stock->date = date('Y-m-d',strtotime($request->input('date')));

            $stock->save();
            // updating the remain amount
            $remain_amount = $available_amount->amount - $request->input('amount');
            $available_amount->amount = $remain_amount;
            $available_amount->save();
            return response()->json('Action completed successfully');

        }
        else {
            return response()->json('Amount to be moved exceeds the available amount');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $stocks = StockMovement::join('crops', 'crops.id', 'stock_movements.crop_id')
                            ->select('crops.name as crop', 'stock_movements.*')
                            ->where('stock_movements.id', $id)
                            ->with('from')
                            ->with('to')
                            ->first();

        // return $stocks;
        return response()->json($stocks);
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
        $stock = StockMovement::find($id);
        $available_amount = StockTaking::where('district_id', $request->input('from'))->first();
        $original = $available_amount->amount + $stock->amount;
        if($original > $request->input('amount')) {
            $stock->trader_name = $request->input('trader_name');
            $stock->from = $request->input('from');
            $stock->to = $request->input('to');
            $stock->crop_id = $request->input('crop_id');
            $stock->amount = $request->input('amount');
            $stock->date = date('Y-m-d',strtotime($request->input('date')));

            $stock->save();
            // updating the remain amount
            $remain_amount = $original - $request->input('amount');
            $available_amount->amount = $remain_amount;
            $available_amount->save();
            return response()->json('Action completed successfully');

        }
        else {
            return response()->json('Amount to be moved exceeds the available amount');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $stock = StockMovement::find($id);
        $from_amount = StockTaking::where('district_id', $stock->from)->first();
        $from_amount->amount += $stock->amount;
        $from_amount->save();

        $stock->delete();

        return response()->json('Action completed successfully');
    }
}
