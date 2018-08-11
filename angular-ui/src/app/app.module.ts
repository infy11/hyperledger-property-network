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
import { GdaComponent } from './gda/gda.component';
import { SharedledgerComponent } from './sharedledger/sharedledger.component';
import { RouterModule, Routes } from '@angular/router';



//Defining routes 
const appRoutes: Routes = [
  { path: 'builder', component: BuilderComponent },
  { path: 'gda', component: GdaComponent },
  { path: 'bank', component: BankComponent },
  { path: 'advocate', component: AdvocateComponent },
  { path: 'shared', component: SharedledgerComponent },
 
 { path: '**', component: SharedledgerComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    AdvocateComponent,
    BankComponent,
    GdaComponent,
    SharedledgerComponent
  ],
  imports: [
    BrowserModule,
    UiModule,
    FormsModule,
    HttpClientModule, 
    AgGridModule.withComponents([]),
    NgProgressModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [BuilderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
