<?php

namespace App\Http\Controllers\Api\v1\Crops;

use App\Http\Controllers\Controller;
use App\Models\Crop;
use Illuminate\Http\Request;

class CropController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $crops = Crop::all();
        $grades = Crop::distinct('grade')->select('grade')->orderBy('grade', 'ASC')->get();
        $collection = collect([]);

        $collection->push($crops, $grades);
        return response()->json($collection);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $crop = new Crop;

        $crop->name = $request->input('name');
        $crop->grade = $request->input('grade');
        $crop->save();

        return response()->json('Crop saved successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $crop = Crop::find($id);

        return response()->json($crop);
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
        $crop = Crop::find($id);

        $crop->name = $request->input('name');
        $crop->grade = $request->input('grade');
        $crop->save();

        return response()->json('Crop updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Crop::find($id)->delete();
        return response()->json('Crop deleted successfully');
    }
}
