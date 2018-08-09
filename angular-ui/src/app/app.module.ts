import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { BuilderComponent } from './builder/builder.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { BuilderService } from "./builder.service";
import { HttpClientModule } from '@angular/common/http'; 
import { NgProgressModule } from 'ngx-progressbar';
import { AdvocateComponent } from './advocate/advocate.component';
import { BankComponent } from './bank/bank.component';





@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    AdvocateComponent,
    BankComponent
  ],
  imports: [
    BrowserModule,
    UiModule,
    FormsModule,
    HttpClientModule, 
    AgGridModule.withComponents([]),
    NgProgressModule
  ],
  providers: [BuilderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
