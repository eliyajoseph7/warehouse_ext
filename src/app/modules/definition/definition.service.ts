import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const baseUrl = 'http://127.0.0.1:8000/api';
const url1 = baseUrl + '/regions'
const url2 = baseUrl + '/districts'
const url3 = baseUrl + '/storage-by-grade'
const url4 = baseUrl + '/warehouse-by-ownership'
const url5 = baseUrl + '/stored-crop-and-capacity'
const url6 = baseUrl + '/warehouse-capacity-and-crops'

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
}
