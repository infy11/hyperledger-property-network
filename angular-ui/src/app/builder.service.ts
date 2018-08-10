import { Injectable } from '@angular/core';
import { Builder } from './builder';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";

const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BuilderService {

  constructor(private http:HttpClient) { }
  addBuilder(builder:Builder):Observable<Builder>{
    return this.http.post<Builder>("http://localhost:3000/builder/builder/builder/create",builder,httpOptions)
  }
  getBuilder():Observable<Builder[]>{
    return this.http.get<Builder[]>("http://localhost:3000/builder/builder/builder/queryall")
  }
  

}
