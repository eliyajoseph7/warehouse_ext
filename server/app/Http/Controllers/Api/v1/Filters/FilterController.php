<?php

namespace App\Http\Controllers\Api\v1\Filters;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    // only by region
    public function onlyByRegion($regionId) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\RegionFilterController')->regionFilter($regionId);
        return response()->json($data);
    }

    // only by region and district
    public function onlyByRegionAndDistrict($districtId) {

        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\RegionAndDistrictFilterController')->regionDistrictFilter($districtId);
        return response()->json($data);
    }

    // only by region and ownership
    public function onlyByRegionAndOwnership($regionId, $ownership) {
        // return Warehouse::where('type', $ownership)->where('region_id', $regionId)->get()->sum('capacity');
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\RegionAndOwnershipFilterController')->regionOwnershipFilter($regionId, $ownership);
        return response()->json($data);
    }

    // only by region ownership and registration
    public function onlyByRegionOwnershipAndRegistration($regionId, $ownership, $registration) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\RegionOwnershipRegistrationFilterController')->regionOwnershipRegistrationFilter($regionId, $ownership, $registration);
        return response()->json($data);
    }

    // only by region, ownership, registration and crop
    public function filterWithExceptionOfDistrictAndCropGrade($regionId, $ownership, $registration, $crop) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\ExceptionOfDistrictAndCropGradeController')->filterWithExceptionOfDistrictAndCropGrade($regionId, $ownership, $registration, $crop);
        return response()->json($data);
    }

    // only by region, ownership, registration, crop and crop grade
    public function filterWithExceptionOfDistrict($regionId, $ownership, $registration, $crop, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\ExceptionOfDistrictController')->filterWithExceptionOfDistrict($regionId, $ownership, $registration, $crop, $grade);
        return response()->json($data);
    }

    // by region, district and ownership
    public function filterRegionDistrictOwnership($regionId, $districtId, $ownership) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\RegionDistrictOwnershipController')->filterRegionDistrictOwnership($regionId, $districtId, $ownership);
        return response()->json($data);
    }

    // by region, district, ownership and registration
    public function filterRegionDistrictOwnershipRegistration($regionId, $districtId, $ownership, $registration) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\RegionDistrictOwnershipRegistrationController')->filterRegionDistrictOwnershipRegistration($regionId, $districtId, $ownership, $registration);
        return response()->json($data);
    }

    // by region, district, ownership, registration and crop
    public function filterAllExceptCropGrade($regionId, $districtId, $ownership, $registration, $crop) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\ExceptCropGradeOnlyController')->excludeCropGrade($regionId, $districtId, $ownership, $registration, $crop);
        return response()->json($data);
    }

    // by region, district, ownership, registration, crop and crop grade
    public function filterAll($regionId, $districtId, $ownership, $registration, $crop, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\AllCombinationController')->filterAll($regionId, $districtId, $ownership, $registration, $crop, $grade);
        return response()->json($data);
    }

    // district and crop are null
    public function districtAndCropAreNull($regionId, $ownership, $registration, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\CropIsNullController')->filterWithoutCrop($regionId, $ownership, $registration, $grade);
        return response()->json($data);
    }

    // district and registration are null
    public function districtAndRegistrationAreNull($regionId, $ownership, $cropId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegistrationIsNullController')->filterWithoutRegistration($regionId, $ownership, $cropId, $grade);
        return response()->json($data);
    }

    // district and ownership are null
    public function districtAndOwnershipAreNull($regionId, $registration, $cropId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipIsNullController')->filterWithoutOwnership($regionId, $registration, $cropId, $grade);
        return response()->json($data);
    }

    // district and region are null
    public function districtAndRegionAreNull($ownership, $registration, $cropId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionIsNullController')->filterWithoutRegion($ownership, $registration, $cropId, $grade);
        return response()->json($data);
    }

    // district, registration and grade are null
    public function districtRegistrationAndGradeAreNull($regionId, $ownership, $cropId) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegistrationAndGradeAreNull')->filterWithoutRegistrationAndGrade($regionId, $ownership, $cropId);
        return response()->json($data);
    }

    // district, ownership and grade are null
    public function districtOwnershipAndGradeAreNull($regionId, $registration, $cropId) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipAndGradeAreNull')->filterWithoutOwnershipAndGrade($regionId, $registration, $cropId);
        return response()->json($data);
    }

    // district, region and grade are null
    public function districtRegionAndGradeAreNull($ownership, $registration, $cropId) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndGradeAreNull')->filterWithoutRegionAndGrade($ownership, $registration, $cropId);
        return response()->json($data);
    }

    // district, registration and crop are null
    public function districtRegistrationAndCropAreNull($regionId, $ownership, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegistrationAndCropAreNull')->filterWithoutRegistrationAndCrop($regionId, $ownership, $grade);
        return response()->json($data);
    }

    // district, ownership and crop are null
    public function districtOwnershipAndCropAreNull($regionId, $registration, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipAndCropAreNull')->filterWithoutOwnershipAndCrop($regionId, $registration, $grade);
        return response()->json($data);
    }

    // district, region and crop are null
    public function districtRegionAndCropAreNull($ownership, $registration, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndCropAreNull')->filterWithoutRegionAndCrop($ownership, $registration, $grade);
        return response()->json($data);
    }

    // district, ownership and registration are null
    public function districtOwnershipAndRegistrationAreNull($regionId, $cropId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipAndRegistrationAreNullController')->filterWithoutOwnershipAndRegistration($regionId, $cropId , $grade);
        return response()->json($data);
    }

    // district, region and registration are null
    public function districtRegionAndRegistrationAreNull($ownership, $cropId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndRegistrationAreNullController')->filterWithoutRegionAndRegistration($ownership, $cropId , $grade);
        return response()->json($data);
    }

    // district, region and ownership are null
    public function districtRegionAndOwnershipnAreNull($registration, $cropId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndOwnershipAreNullController')->filterWithoutRegionAndOwnership($registration, $cropId , $grade);
        return response()->json($data);
    }

    // only region and ownership
    public function onlyRegionAndOwnership($regionId, $ownership) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndOwnershipController')->filterWithRegionAndOwnership($regionId, $ownership);
        return response()->json($data);
    }

    // only region and registration
    public function onlyRegionAndRegistration($regionId, $registration) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndRegistrationController')->filterWithRegionAndRegistration($regionId, $registration);
        return response()->json($data);
    }

    // only region and crop
    public function onlyRegionAndCrop($regionId, $crop) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndCropController')->filterWithRegionAndCrop($regionId, $crop);
        return response()->json($data);
    }

    // only region and grade
    public function onlyRegionAndGrade($regionId, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegionAndGradeController')->filterWithRegionAndGrade($regionId, $grade);
        return response()->json($data);
    }

    // only ownership and registration
    public function onlyOwnershipAndRegistration($ownership, $registration) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipAndRegistrationController')->filterWithOwnershipAndRegistration($ownership, $registration);
        return response()->json($data);
    }

    // only ownership and crop
    public function onlyOwnershipAndCrop($ownership, $crop) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipAndCropController')->filterWithOwnershipAndCrop($ownership, $crop);
        return response()->json($data);
    }

    // only ownership and grade
    public function onlyOwnershipAndGrade($ownership, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipAndGradeController')->filterWithOwnershipAndGrade($ownership, $grade);
        return response()->json($data);
    }

    // only registration and crop
    public function onlyRegistrationAndCrop($registration, $crop) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegistrationAndCropController')->filterWithRegistrationAndCrop($registration, $crop);
        return response()->json($data);
    }

    // only registration and grade
    public function onlyRegistrationAndGrade($registration, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegistrationAndGradeController')->filterWithRegistrationAndGrade($registration, $grade);
        return response()->json($data);
    }

    // only crop and grade
    public function onlyCropAndGrade($crop, $grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\CropAndGradeController')->filterWithCropAndGrade($crop, $grade);
        return response()->json($data);
    }

    // only ownership
    public function onlyOwnership($ownership) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\OwnershipController')->filterWithOnlyOwnership($ownership);
        return response()->json($data);
    }

    // only registration
    public function onlyRegistration($registration) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\RegistrationController')->filterWithOnlyRegistration($registration);
        return response()->json($data);
    }

    // only crop
    public function onlyCrop($crop) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\CropController')->filterWithOnlyCrop($crop);
        return response()->json($data);
    }

    // only crop grade
    public function onlyCropGrade($grade) {
        $data = app('App\Http\Controllers\Api\v1\Filters\Categories\excludeDistrict\CropGradeController')->filterWithOnlyCropGrade($grade);
        return response()->json($data);
    }
}
