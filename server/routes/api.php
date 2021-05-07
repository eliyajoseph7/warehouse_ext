<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('regions', 'Api\v1\RegionDistrict\RegionDistrictController@getAllRegions');
Route::get('districts/{regionId}', 'Api\v1\RegionDistrict\RegionDistrictController@getDistricts');

// managements
Route::Resource('warehouse', 'Api\v1\Managements\ManagementController');

// markets
Route::Resource('markets', 'Api\v1\Markets\MarketController');

// crops
Route::Resource('crops', 'Api\v1\Crops\CropController');

// stocks
Route::resource('stock-taking', 'Api\v1\Stocks\StockTakingController');
Route::resource('stock-movement', 'Api\v1\Stocks\StockMovementController');
Route::resource('goods-reception', 'Api\v1\Stocks\GoodsReceptionController');

// charts
Route::get('storage-by-grade', 'Api\v1\Charts\DrawChartController@storageByGrade');
Route::get('warehouse-by-ownership', 'Api\v1\Charts\DrawChartController@storageByOwnership');
Route::get('stored-crop-and-capacity', 'Api\v1\Charts\DrawChartController@storedCropAndCapacity');
Route::get('warehouse-capacity-and-crops', 'Api\v1\Charts\DrawChartController@warehouseCapacityAndCrops');
