import { Component, Input , OnInit} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @Input() brand: string;


  constructor() { 
    
  }

  ngOnInit() {
    console.log("is console log working")
    console.log(this.brand);
  }

}
