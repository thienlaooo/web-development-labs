import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MedicineListComponent } from './medicine-list/medicine-list.component';
import { HomeComponent } from './home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpInterceptorService} from "./services/httpInterceptor.service";
import { UserComponent } from './user/user.component';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MedicineListComponent,
    HomeComponent,
    LoginComponent,
    UserComponent,
    MedicineDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
