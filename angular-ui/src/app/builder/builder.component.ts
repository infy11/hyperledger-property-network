import { Component, OnInit } from '@angular/core';
import {Builder} from '../builder'
import {BuilderService } from '../builder.service';
import swal from 'sweetalert';
import { NgProgress } from 'ngx-progressbar';



@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit {
  builder:Builder=new Builder('',0,'','','');
  columnDefs = [
    {headerName: 'PropertyID',valueGetter: 'data.Key'},
    {headerName: 'BuilderID', valueGetter: 'data.Record.builderid' },
    {headerName: 'BuilderName', valueGetter : 'data.Record.buildername' },
    {headerName: 'Address', valueGetter : 'data.Record.address'},
    {headerName: 'Status',valueGetter :'data.Record.status'}

];

rowData = [];
 gridApi: any;
refresh(){
  this.ngProgress.start();
  this.builderService.getBuilder().subscribe(
    Builder=>
    { 
      this.ngProgress.done();

      console.log(Builder)
      this.rowData=Builder;
      
    }

   );
  this.gridApi.setRowData(this.rowData);

}
submit(){
  this.builderService.addBuilder(this.builder).subscribe(
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
        this.builder.Address='';
        this.builder.BuilderID=0;
        this.builder.BuilderName='';
        this.builder.PropertyID='';
        this.builder.Status='';
      }
    }
  )
}

onGridReady(params) {
  this.gridApi = params.api;
  
}

  constructor(private builderService:BuilderService,public ngProgress: NgProgress) {
    this.builderService.getBuilder().subscribe(
      Builder=>
      { 
       
        this.rowData=Builder;
        
      }
  
     );
   }

   

  ngOnInit() {
    


  }

}
