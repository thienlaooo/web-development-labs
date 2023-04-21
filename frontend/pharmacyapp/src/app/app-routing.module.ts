import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {UserComponent} from "./user/user.component";
import {MedicineDetailsComponent} from "./medicine-details/medicine-details.component";
import {AllMedicinesComponent} from "./all-medicines/all-medicines.component";
import {CartComponent} from "./cart/cart.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent},
  {path: 'detail/:id', component: MedicineDetailsComponent},
  {path: 'medicines', component:AllMedicinesComponent},
  {path: 'cart', component:CartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
