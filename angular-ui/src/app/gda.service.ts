import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { Gda } from './gda';


const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class GdaService {

  constructor(private http:HttpClient) { }
  addGda(gda:Gda):Observable<Gda>{
    return this.http.post<Gda>("http://localhost:3000/gda/gda/gda/create/",gda,httpOptions)
  }
  getGda():Observable<Gda[]>{
    return this.http.get<Gda[]>("http://localhost:3000/gda/gda/gda/queryall")
  }
  

}