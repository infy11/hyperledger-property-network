import { Component, OnInit } from '@angular/core';
import { SharedledgerService } from '../sharedledger.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-sharedledger',
  templateUrl: './sharedledger.component.html',
  styleUrls: ['./sharedledger.component.css']
})
export class SharedledgerComponent implements OnInit {
  BuilderDetails : string ;
  PropertyID: string;
  GdaDetails:string;
  BankDetails:string;
  AdvocateDetails:string;

  constructor(private sharedLedgerService:SharedledgerService,public ngProgress: NgProgress) { }

  getBuilder(){
 
    this.sharedLedgerService.getBuilderDetails(this.PropertyID).subscribe(
      builder=>
      {  this.ngProgress.start();
        
        this.ngProgress.done();
        this.BuilderDetails=JSON.stringify(builder);
        
      }
  
     );


  }
  getGda(){
 
    this.sharedLedgerService.getGdaDetails(this.PropertyID).subscribe(
      Gda=>
      {  this.ngProgress.start();
         console.log("INSIDE GET GDA FUNCTION"+Gda);
        
        
        this.ngProgress.done();
        this.GdaDetails=JSON.stringify(Gda);
        
      }
  
     );


  }
  getBank(){
 
    this.sharedLedgerService.getBankDetails(this.PropertyID).subscribe(
      bank=>
      {  this.ngProgress.start();
        
        this.ngProgress.done();
        this.BankDetails=JSON.stringify(bank);
        
      }
  
     );


  }
  getAdvocate(){
 
    this.sharedLedgerService.getAdvocateDetails(this.PropertyID).subscribe(
      advocate=>
      {  this.ngProgress.start();
        
        this.ngProgress.done();
        this.AdvocateDetails=JSON.stringify(advocate);
        
      }
  
     );


  }


  ngOnInit() {
  }

}
