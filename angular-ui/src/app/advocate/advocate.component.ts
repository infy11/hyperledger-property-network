import { Component, OnInit } from '@angular/core';
import {Advocate} from '../advocate'
import {AdvocateService } from '../advocate.service';
import swal from 'sweetalert';
import { NgProgress } from 'ngx-progressbar';


@Component({
  selector: 'app-advocate',
  templateUrl: './advocate.component.html',
  styleUrls: ['./advocate.component.css']
})
export class AdvocateComponent implements OnInit {
  advocate:Advocate=new Advocate('','','','','','','');
  columnDefs = [



    {headerName: 'PropertyID',valueGetter: 'data.Key'},
    {headerName: 'Advocate ID', valueGetter: 'data.Record.advocateid' },
    {headerName: 'Advocate Name', valueGetter : 'data.Record.advocateName' },
    {headerName: 'Current Owner', valueGetter : 'data.Record.currentowner' },
    {headerName: 'New Owner', valueGetter : 'data.Record.newOwner'},
    {headerName: 'Document Hash',valueGetter :'data.Record.documenthash'},
    {headerName: 'Document Url',valueGetter :'data.Record.documenturl'}

];

rowData = [];
 gridApi: any;
refresh(){
  this.ngProgress.start();
  this.advocateService.getAdvocate().subscribe(
    Advocate=>
    { 
      this.ngProgress.done();

      console.log(Advocate)
      this.rowData=Advocate;
      
    }

   );
  this.gridApi.setRowData(this.rowData);  

}
submit(){
  this.advocateService.addAdvocate(this.advocate).subscribe(
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
        this.advocate.PropertyID='';
        this.advocate.AdvocateID='';
        this.advocate.AdvocateName='';
        this.advocate.CurrentOwner='';
        this.advocate.NewOwner='';
        this.advocate.DocumentHash='';
        this.advocate.DocumentUrl='';
      }
    }
  )
}

onGridReady(params) {
  this.gridApi = params.api;
  
}

  constructor(private advocateService:AdvocateService,public ngProgress: NgProgress) {
    this.advocateService.getAdvocate().subscribe(
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
