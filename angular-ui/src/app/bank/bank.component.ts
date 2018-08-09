import { Component, OnInit } from '@angular/core';
import { Bank } from '../bank';
import {BankService} from '../bank.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  bank:Bank=new Bank('','','','');
  columnDefs = [



    {headerName: 'PropertyID',valueGetter: 'data.Key'},
    {headerName: 'Bank ID', valueGetter: 'data.Record.bankid' },
    {headerName: 'Borrower ID', valueGetter : 'data.Record.borrowerid' },
    {headerName: 'Ammount', valueGetter : 'data.Record.ammount' },
   

];

rowData = [];
 gridApi: any;
refresh(){
  this.ngProgress.start();
  this.bankService.getBank().subscribe(
    Bank=>
    { 
      this.ngProgress.done();

      console.log(Bank)
      this.rowData=Bank;
      
    }

   );
  this.gridApi.setRowData(this.rowData);  

}
submit(){
  this.bankService.addBank(this.bank).subscribe(
    res=>{
      console.log(res);
      if(res)
      {
        
        var params = { force: true , enableCellChangeFlash:true};
        
        swal({
          title: "Success",
          text: "Record Created Successfully",
          icon: "success",

        });
        this.bank.PropertyID='';
        this.bank.BankID='';
        this.bank.BorrowerID='';
        this.bank.Ammount='';
      
      }
    }
  )
}

onGridReady(params) {
  this.gridApi = params.api;
  
}

  constructor(private bankService:BankService,public ngProgress: NgProgress) {
    this.bankService.getBank().subscribe(
      advocate=>
      { 
        console.log(advocate);
       
        this.rowData=advocate;
        
      }
  
     );
   }

   

  ngOnInit() {
    


  }

}
