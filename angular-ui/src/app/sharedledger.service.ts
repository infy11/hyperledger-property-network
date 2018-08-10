import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { Builder } from './builder';
import { Gda } from './gda';
import { Bank } from './bank';
import { Advocate } from './advocate';


const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}
@Injectable({
  providedIn: 'root'
})
export class SharedledgerService {

  constructor(private http:HttpClient) { }

  getBuilderDetails(propertyID: string):Observable<Builder>{
   
    return this.http.get<Builder>("http://localhost:3000/shared/builder/builder/querybuilder/"+propertyID)
  }

  getGdaDetails(propertyID:string):Observable<Gda>{
    return this.http.get<Gda>("http://localhost:3000/shared/gda/gda/querygda/"+propertyID)
  }

  getBankDetails(propertyID:string):Observable<Bank>{
    return this.http.get<Bank>("http://localhost:3000/shared/bank/bank/querybank/"+propertyID)
  }
  getAdvocateDetails(propertyID:string):Observable<Advocate>{
    return this.http.get<Advocate>("http://localhost:3000/shared/advocate/advocate/queryadvocate/"+propertyID)
  }

}

