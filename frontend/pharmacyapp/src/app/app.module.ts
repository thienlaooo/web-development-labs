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
import { AllMedicinesComponent } from './all-medicines/all-medicines.component';
import { CartComponent } from './cart/cart.component';
import { RegisterComponent } from './register/register.component';
import { MedicineSearchComponent } from './medicine-search/medicine-search.component';
import { UserListComponent } from './user-list/user-list.component';
import {AuthGuardService as AuthGuard} from "./services/auth-guard.service";
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MedicineListComponent,
    HomeComponent,
    LoginComponent,
    UserComponent,
    MedicineDetailsComponent,
    AllMedicinesComponent,
    CartComponent,
    RegisterComponent,
    MedicineSearchComponent,
    UserListComponent,
    NotFoundComponent
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
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
