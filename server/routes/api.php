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
Route::get('regions-in-stock-taking', 'Api\v1\RegionDistrict\RegionDistrictController@getRegionsAvailableInStockTaking');
Route::get('districts-in-stock-taking/{regionId}', 'Api\v1\RegionDistrict\RegionDistrictController@getDistrictsAvailableInStockTaking');
Route::get('districts/{regionId}', 'Api\v1\RegionDistrict\RegionDistrictController@getDistricts');
Route::get('regions-in-stock-movement', 'Api\v1\RegionDistrict\RegionDistrictController@getRegionsAvailableInStockMovement');
Route::get('districts-in-stock-movement/{regionId}', 'Api\v1\RegionDistrict\RegionDistrictController@getdistrictsAvailableInStockMovement');

Route::get('amount-to-be-received/{districtId}/{cropId}', 'Api\v1\RegionDistrict\RegionDistrictController@amountToBeReceived');
Route::get('transfered-crops/{districtId}', 'Api\v1\RegionDistrict\RegionDistrictController@transferedCropsByDistrict');

// managements
Route::Resource('warehouse', 'Api\v1\Managements\ManagementController');
Route::get('warehouses-by-location/{regionId}', 'Api\v1\Managements\ManagementController@getWarehouses');

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
Route::get('warehouse-utilization', 'Api\v1\Charts\DrawChartController@warehouseUtilization');
Route::get('warehouse-ownership-registration/{type}', 'Api\v1\Charts\DrawChartController@warehouseOwnershipRegistration');
Route::get('crops-by-location', 'Api\v1\Charts\DrawChartController@getCropsByLocation');


// filters
// only by region
Route::get('filter-by-region/{regionId}', 'Api\v1\Filters\FilterController@onlyByRegion');
// only region and district
Route::get('filter-by-district/{districtId}', 'Api\v1\Filters\FilterController@onlyByRegionAndDistrict');
// region and ownership
Route::get('filter-by-region-and-ownership/{regionId}/{ownership}', 'Api\v1\Filters\FilterController@onlyByRegionAndOwnership');
// region, ownership and registration
Route::get('filter-by-region-ownership-and-registration/{regionId}/{ownership}/{registration}', 'Api\v1\Filters\FilterController@onlyByRegionOwnershipAndRegistration');
// except district and crop grade
Route::get('filter-except-district-and-cropgrade/{regionId}/{ownership}/{registration}/{crop}', 'Api\v1\Filters\FilterController@filterWithExceptionOfDistrictAndCropGrade');
// except district
Route::get('filter-except-district/{regionId}/{ownership}/{registration}/{crop}/{grade}', 'Api\v1\Filters\FilterController@filterWithExceptionOfDistrict');
// region, district and ownership
Route::get('region-district-ownership/{regionId}/{districtId}/{ownership}', 'Api\v1\Filters\FilterController@filterRegionDistrictOwnership');
// region, district, ownership and registration
Route::get('region-district-ownership-registration/{regionId}/{districtId}/{ownership}/{registration}', 'Api\v1\Filters\FilterController@filterRegionDistrictOwnershipRegistration');
// region, district, ownership, registration and crop
Route::get('with-district-except-cropgrade/{regionId}/{districtId}/{ownership}/{registration}/{cropId}', 'Api\v1\Filters\FilterController@filterAllExceptCropGrade');
// all combinations
Route::get('all-combinations/{regionId}/{districtId}/{ownership}/{registration}/{cropId}/{grade}', 'Api\v1\Filters\FilterController@filterAll');

// district and crop are null
Route::get('district-and-crop-are-null/{regionId}/{ownership}/{registration}/{grade}', 'Api\v1\Filters\FilterController@districtAndCropAreNull');

// district and registration are null
Route::get('district-and-registration-are-null/{regionId}/{ownership}/{cropId}/{grade}', 'Api\v1\Filters\FilterController@districtAndRegistrationAreNull');

// district and ownership are null
Route::get('district-and-ownership-are-null/{regionId}/{registration}/{cropId}/{grade}', 'Api\v1\Filters\FilterController@districtAndOwnershipAreNull');

// district and region are null
Route::get('district-and-region-are-null/{ownership}/{registration}/{cropId}/{grade}', 'Api\v1\Filters\FilterController@districtAndRegionAreNull');

// district, registration and grade are null
Route::get('district-registration-and-grade-are-null/{region}/{ownership}/{cropId}', 'Api\v1\Filters\FilterController@districtRegistrationAndGradeAreNull');

// district, ownership and grade are null
Route::get('district-ownership-and-grade-are-null/{region}/{registration}/{cropId}', 'Api\v1\Filters\FilterController@districtOwnershipAndGradeAreNull');

// district, region and grade are null
Route::get('district-region-and-grade-are-null/{ownership}/{registration}/{cropId}', 'Api\v1\Filters\FilterController@districtRegionAndGradeAreNull');

// district, registration and crop are null
Route::get('district-registration-and-crop-are-null/{regionId}/{ownership}/{grade}', 'Api\v1\Filters\FilterController@districtRegistrationAndCropAreNull');

// district, ownership and crop are null
Route::get('district-ownership-and-crop-are-null/{regionId}/{registration}/{grade}', 'Api\v1\Filters\FilterController@districtOwnershipAndCropAreNull');

// district, region and crop are null
Route::get('district-region-and-crop-are-null/{ownership}/{registration}/{grade}', 'Api\v1\Filters\FilterController@districtRegionAndCropAreNull');

// district, ownership and registration are null
Route::get('district-ownership-and-registration-are-null/{regionId}/{crop}/{grade}', 'Api\v1\Filters\FilterController@districtOwnershipAndRegistrationAreNull');

// district, region and registration are null
Route::get('district-region-and-registration-are-null/{ownership}/{crop}/{grade}', 'Api\v1\Filters\FilterController@districtRegionAndRegistrationAreNull');

// district, region and ownership are null
Route::get('district-region-and-ownership-are-null/{registration}/{crop}/{grade}', 'Api\v1\Filters\FilterController@districtRegionAndOwnershipnAreNull');
