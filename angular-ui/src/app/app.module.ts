import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { UiModule } from './ui/ui.module';
import { BuilderComponent } from './builder/builder.component';
import { AgGridModule } from 'ag-grid-angular';

import { FormsModule } from '@angular/forms';
import { BuilderService } from "./builder.service";
import { HttpClientModule } from '@angular/common/http'; 




@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent
  ],
  imports: [
    BrowserModule,
    UiModule,
    FormsModule,
    HttpClientModule, 
    AgGridModule.withComponents([])
  ],
  providers: [BuilderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
