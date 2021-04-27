import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const baseUrl = 'http://127.0.0.1:8000/api';
const url1 = baseUrl + '/regions'
const url2 = baseUrl + '/districts'

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
}
