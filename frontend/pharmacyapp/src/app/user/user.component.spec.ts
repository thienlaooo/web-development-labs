import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { HttpClientModule } from "@angular/common/http";
import { NavbarComponent } from "../navbar/navbar.component";
import {of} from "rxjs";
import {UserService} from "../services/user.service";
import {AppRoutingModule} from "../app-routing.module";

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userServiceMock;
  let mockUserData = {
    id: 1,
    first_name: "Oleh",
    last_name: "Rysin",
    phone: "0654327864",
    email: "someemail@gmail.com",
    password: "Sokwelwefg23423",
    role: "pharmacist"
  };

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser', 'editUser']);
    userServiceMock.getUser.and.returnValue(of(mockUserData));
    await TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      imports: [HttpClientModule, AppRoutingModule],
      providers: [
        {provide: UserService, useValue: userServiceMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
