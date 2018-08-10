import { Component, OnInit } from '@angular/core';
import { Gda } from '../gda';
import { GdaService } from '../gda.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-gda',
  templateUrl: './gda.component.html',
  styleUrls: ['./gda.component.css']
})
export class GdaComponent implements OnInit {


  gda:Gda=new Gda('','','');
  columnDefs = [



    {headerName: 'PropertyID',valueGetter: 'data.Key'},
    {headerName: 'Current Owner', valueGetter: 'data.Record.currentowner' },
    {headerName: 'Approval Status', valueGetter : 'data.Record.approvalstatus' },
    
   

];

rowData = [];
 gridApi: any;
refresh(){
  this.ngProgress.start();
  this.gdaService.getGda().subscribe(
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
  this.gdaService.addGda(this.gda).subscribe(
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
        this.gda.PropertyID='';
        this.gda.CurrentOwner='';
        this.gda.ApprovalStatus='';
       
      
      }
    }
  )
}

onGridReady(params) {
  this.gridApi = params.api;
  
}

  constructor(private gdaService:GdaService,public ngProgress: NgProgress) {
    this.gdaService.getGda().subscribe(
      gda=>
      { 
        console.log(gda);
       
        this.rowData=gda;
        
      }
  
     );
   }

   

  ngOnInit() {
    


  }
}
