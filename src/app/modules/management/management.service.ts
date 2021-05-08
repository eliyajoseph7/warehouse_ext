import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseUrl = 'http://stocks.multics.co.tz/public/api';
// const baseUrl = 'http://127.0.0.1:8000/api';
const url1 = baseUrl + '/warehouse'
const url2 = baseUrl + '/markets'
const url3 = baseUrl + '/crops'
const url4 = baseUrl + '/stock-taking'
const url5 = baseUrl + '/stock-movement'
const url6 = baseUrl + '/goods-reception'
@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
     'X-Requested-Width': 'XMLHttpRequeest',
    'Access-Control-Allow-Origin': '*'
   });
  constructor(private http: HttpClient) { }

  getWarehouseData() {
    return this.http.get(url1, {headers: this.headers})
  }

  addWarehouseData(data) {
    return this.http.post(url1, data, {headers: this.headers});
  }
  getWarehouseSingleData(id) {
    return this.http.get(url1 + '/' + id, {headers: this.headers});
  }

  updateWarehouseData(data, id) {
    return this.http.put(url1 + '/' + id, data, {headers: this.headers});
  }

  deleteWarehouseData(id) {
    return this.http.delete(url1 + '/' + id, {headers: this.headers});
  }

  // markets
  getWarehouseMarkets() {
    return this.http.get(url2, {headers: this.headers});
  }
  addWarehouseMarket(data) {
    return this.http.post(url2, data, {headers: this.headers});
  }
  getWarehouseSingleMarket(id) {
    return this.http.get(url2 + '/' + id, {headers: this.headers});
  }

  updateWarehouseMarket(data, id) {
    return this.http.put(url2 + '/' + id, data, {headers: this.headers});
  }

  deleteWarehouseMarket(id) {
    return this.http.delete(url2 + '/' + id, {headers: this.headers});
  }

  // Crops
  getWarehouseCrops() {
    return this.http.get(url3, {headers: this.headers});
  }
  addWarehouseCrop(data) {
    return this.http.post(url3, data, {headers: this.headers});
  }
  getWarehouseSingleCrop(id) {
    return this.http.get(url3 + '/' + id, {headers: this.headers});
  }

  updateWarehouseCrop(data, id) {
    return this.http.put(url3 + '/' + id, data, {headers: this.headers});
  }

  deleteWarehouseCrop(id) {
    return this.http.delete(url3 + '/' + id, {headers: this.headers});
  }

  // stock taking
  stockTakingsData() {
    return this.http.get(url4, {headers: this.headers});
  }
  getStockTakingSingleData(id) {
    return this.http.get(url4 + '/' + id, {headers: this.headers});
  }
  addStockTakingsData(data) {
    return this.http.post(url4, data, {headers: this.headers});
  }
  updateStockTakingsData(data, id) {
    return this.http.put(url4 + '/' + id, data, {headers: this.headers});
  }
  deleteStockTakingsData(id) {
    return this.http.delete(url4 + '/' + id, {headers: this.headers});
  }

  // stock movement
  stockMovementsData() {
    return this.http.get(url5, {headers: this.headers});
  }

  // goods reception
  goodsReceptionData() {
    return this.http.get(url6, {headers: this.headers});
  }
}
