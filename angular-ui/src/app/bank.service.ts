import { Injectable } from '@angular/core';
import { Bank } from './bank';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";


const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http:HttpClient) { }
  addBank(bank:Bank):Observable<Bank>{
    return this.http.post<Bank>("http://localhost:3000/bank/bank1/bank/create/",bank,httpOptions)
  }
  getBank():Observable<Bank[]>{
    return this.http.get<Bank[]>("http://localhost:3000/bank/bank1/bank/queryall")
  }
  

}