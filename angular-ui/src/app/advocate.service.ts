import { Injectable } from '@angular/core';
import { Advocate } from './advocate';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";


const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AdvocateService {

  constructor(private http:HttpClient) { }
  addAdvocate(advocate:Advocate):Observable<Advocate>{
    return this.http.post<Advocate>("http://localhost:3000/advocate/advocate/advocate/create/",advocate,httpOptions)
  }
  getAdvocate():Observable<Advocate[]>{
    return this.http.get<Advocate[]>("http://localhost:3000/advocate/advocate/advocate/queryall")
  }
  

}
