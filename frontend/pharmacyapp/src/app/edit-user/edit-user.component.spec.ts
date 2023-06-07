import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserComponent } from './edit-user.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {UserService} from "../services/user.service";
import {of} from "rxjs";
import {ReactiveFormsModule} from "@angular/forms";

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
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
      declarations: [ EditUserComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: UserService, useValue: userServiceMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
