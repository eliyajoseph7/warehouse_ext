import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const baseUrl = 'http://stocks.multics.co.tz/public/api';
// const baseUrl = 'http://127.0.0.1:8000/api';
const url1 = baseUrl + '/regions'
const url2 = baseUrl + '/districts'
const url3 = baseUrl + '/storage-by-grade'
const url4 = baseUrl + '/warehouse-by-ownership'
const url5 = baseUrl + '/stored-crop-and-capacity'
const url6 = baseUrl + '/warehouse-capacity-and-crops'
const url7 = baseUrl + '/warehouse-utilization'
const url8 = baseUrl + '/warehouse-ownership-registration/'
const url9 = baseUrl + '/crops-by-location'
const url10 = baseUrl + '/filter-by-region/'
const url11 = baseUrl + '/filter-by-district/'
const url12 = baseUrl + '/filter-by-region-and-ownership/'
const url13 = baseUrl + '/filter-by-region-ownership-and-registration/'
const url14 = baseUrl + '/filter-except-district-and-cropgrade/'
const url15 = baseUrl + '/filter-except-district/'
const url16 = baseUrl + '/region-district-ownership/'
const url17 = baseUrl + '/region-district-ownership-registration/'
const url18 = baseUrl + '/with-district-except-cropgrade/'
const url19 = baseUrl + '/all-combinations/'
const url20 = baseUrl + '/district-and-crop-are-null/'
const url21 = baseUrl + '/district-and-registration-are-null/'
const url22 = baseUrl + '/district-and-ownership-are-null/'
const url23 = baseUrl + '/district-and-region-are-null/'
const url24 = baseUrl + '/district-registration-and-grade-are-null/'
const url25 = baseUrl + '/district-ownership-and-grade-are-null/'
const url26 = baseUrl + '/district-region-and-grade-are-null/'
const url27 = baseUrl + '/district-registration-and-crop-are-null/'
const url28 = baseUrl + '/district-ownership-and-crop-are-null/'
const url29 = baseUrl + '/district-region-and-crop-are-null/'
const url30 = baseUrl + '/district-ownership-and-registration-are-null/'
const url31 = baseUrl + '/district-region-and-registration-are-null/'
const url32 = baseUrl + '/district-region-and-ownership-are-null/'

@Injectable({
  providedIn: 'root'
})
export class DefinitionService {

  headers = new HttpHeaders({'Content-Type': 'application/json', 'X-Requested-Width': 'XMLHttpRequeest'});
  constructor(private http: HttpClient) { }

  getAllRegions() {
    return this.http.get(url1, {headers: this.headers});
  }

  getDistricts(regionId) {
    return this.http.get(url2 + '/' + regionId, {headers: this.headers});
  }

  getStorageByGradeData() {
    return this.http.get(url3, {headers: this.headers});
  }

  getWarehouseByOwnership() {
    return this.http.get(url4, {headers: this.headers});
  }

  storageCropAndCapacity() {
    return this.http.get(url5, {headers: this.headers});
  }

  warehouseCapacityAndCrops() {
    return this.http.get(url6, {headers: this.headers});
  }

  warehouseUtilization() {
    return this.http.get(url7, {headers: this.headers});
  }

  warehouseOwnershipRegistration(type) {
    return this.http.get(url8 + type, {headers: this.headers});
  }

  storedCropsByLocation() {
    return this.http.get(url9, {headers: this.headers});
  }

  // filtres
  filterByOnlyRegion(regionId) {
    return this.http.get(url10 + regionId, {headers: this.headers});
  }
  filterByOnlyRegionAndDistrict(district) {
    return this.http.get(url11 + district, {headers: this.headers});
  }
  filterByRegionAndOwnership(region, ownership) {
    return this.http.get(url12 + region +'/'+ ownership, {headers: this.headers});
  }
  filterByRegionOwnershipAndRegistration(region, ownership, registration) {
    return this.http.get(url13 + region +'/'+ ownership + '/'+ registration, {headers: this.headers});
  }
  filterWithExceptionOfDistrictAndCropGrade(region, ownership, registration, $crop) {
    return this.http.get(url14 + region +'/'+ ownership + '/'+ registration+ '/'+ $crop, {headers: this.headers});
  }
  filterWithExceptionOfDistrict(region, ownership, registration, $crop, $grade) {
    return this.http.get(url15 + region +'/'+ ownership + '/'+ registration+ '/'+ $crop + '/' + $grade, {headers: this.headers});
  }


  filterByOnlyRegionDistrictAndOwnership(region, district, ownership) {
    return this.http.get(url16 + region +'/'+ district + '/'+ ownership, {headers: this.headers});
  }

  filterByOnlyRegionDistrictAndOwnershipRegistration(region, district, ownership, registration) {
    return this.http.get(url17 + region +'/'+ district + '/'+ ownership + '/' + registration, {headers: this.headers});
  }

  filterDistrictExceptCropGrade(region, district, ownership, registration, crop) {
    return this.http.get(url18 + region +'/'+ district + '/'+ ownership + '/' + registration + '/' + crop, {headers: this.headers});
  }

  filterByAllCombinations(region, district, ownership, registration, crop, grade) {
    return this.http.get(url19 + region +'/'+ district + '/'+ ownership + '/' + registration + '/' + crop + '/' + grade, {headers: this.headers});
  }

  districtAndCropAreNull(region, ownership, registration, grade) {
    return this.http.get(url20 + region + '/'+ ownership + '/' + registration + '/' + grade, {headers: this.headers});
  }

  districtAndRegistrationAreNull(region, ownership, crop, grade) {
    return this.http.get(url21 + region + '/'+ ownership + '/' + crop + '/' + grade, {headers: this.headers});
  }

  districtAndOwnershipAreNull(region, registration, crop, grade) {
    return this.http.get(url22 + region + '/'+ registration + '/' + crop + '/' + grade, {headers: this.headers});
  }

  districtAndRegionAreNull(ownership, registration, crop, grade) {
    return this.http.get(url23 + ownership + '/'+ registration + '/' + crop + '/' + grade, {headers: this.headers});
  }

  districtRegistrationAndGradeAreNull(region, ownership, crop) {
    return this.http.get(url24 + region + '/'+ ownership + '/' + crop, {headers: this.headers});
  }

  districtOwnershipAndGradeAreNull(region, registration, crop) {
    return this.http.get(url25 + region + '/'+ registration + '/' + crop, {headers: this.headers});
  }

  districtRegionAndGradeAreNull(ownership, registration, crop) {
    return this.http.get(url26 + ownership + '/'+ registration + '/' + crop, {headers: this.headers});
  }

  districtRegistrationAndCropAreNull(region, ownership, grade) {
    return this.http.get(url27 + region + '/'+ ownership + '/' + grade, {headers: this.headers});
  }

  districtOwnershipAndCropAreNull(region, registration, grade) {
    return this.http.get(url28 + region + '/'+ registration + '/' + grade, {headers: this.headers});
  }

  districtRegionAndCropAreNull(ownership, registration, grade) {
    return this.http.get(url29 + ownership + '/'+ registration + '/' + grade, {headers: this.headers});
  }

  districtOwnershipAndRegistrationAreNull(regionId, crop, grade) {
    return this.http.get(url30 + regionId + '/'+ crop + '/' + grade, {headers: this.headers});
  }

  districtRegionAndRegistrationAreNull(ownership, crop, grade) {
    return this.http.get(url31 + ownership + '/'+ crop + '/' + grade, {headers: this.headers});
  }

  districtRegionAndOwnershipAreNull(registration, crop, grade) {
    return this.http.get(url32 + registration + '/'+ crop + '/' + grade, {headers: this.headers});
  }
}
