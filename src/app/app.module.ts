import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }
  
];

@NgModule({
  declarations: [
    //AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  //bootstrap: [AppComponent]
})


export class AppModule { }