import { Component, OnInit } from '@angular/core';
import {Builder} from '../builder'
import {BuilderService } from '../builder.service';

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
submit(){
  this.builderService.addBuilder(this.builder).subscribe(
    res=>{
     console.log(res)
    }
  )
}

  constructor(private builderService:BuilderService) {
    this.builderService.getBuilder().subscribe(
      Builder=>
      { 
        console.log(Builder)
        this.rowData=Builder;
        
      }
  
     );
   }

   

  ngOnInit() {
  }

}
