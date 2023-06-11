import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from "@angular/common/http";
import { UserListComponent } from './user-list.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AuthenticationService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {User} from "../models";
import {of, throwError} from "rxjs";
import {AppErrorDialogComponent} from "../app-error-dialog/app-error-dialog.component";

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let mockUserData: User[] = [
    { id: 1,
      first_name: "First",
      last_name: "User",
      phone: "0654327864",
      email: "someemail@gmail.com",
      password: "Sokwelwefg23423",
      role: "customer" },
    { id: 2,
      first_name: "Second",
      last_name: "User",
      phone: "0654337864",
      email: "someemail2@gmail.com",
      password: "Sokwelwwdwdefg23423",
      role: "pharmacist" },
  ];

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser', 'makeAdmin']);
    authServiceMock = jasmine.createSpyObj('AuthenticationService', [], { authenticated$: true });
    userServiceMock.getUsers.and.returnValue(of(mockUserData));
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers and populate users, customers, and admins arrays on ngOnInit', () => {
    const mockUsers: User[] = [
      { id: 1,
        first_name: "First",
        last_name: "User",
        phone: "0654327864",
        email: "someemail@gmail.com",
        password: "Sokwelwefg23423",
        role: "customer" },
      { id: 2,
        first_name: "Second",
        last_name: "User",
        phone: "0654337864",
        email: "someemail2@gmail.com",
        password: "Sokwelwwdwdefg23423",
        role: "pharmacist" },
    ];

    userServiceMock.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.customers).toEqual([mockUsers[0]]);
    expect(component.admins).toEqual([mockUsers[1]]);
  });

  it('should call deleteUser and refresh users on deleteUser', () => {
    const userId = 1;

    userServiceMock.deleteUser.and.returnValue(of({message: "success"}));

    spyOn(component, 'ngOnInit');

    component.deleteUser(userId);

    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(userId);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should handle error when deleteUser fails', () => {
    const userId = 1;
    const errorMessage = 'Error occurred while deleting user';
    userServiceMock.deleteUser.and.returnValue(throwError({ error: errorMessage }));

    spyOn(component, 'ngOnInit');

    component.deleteUser(userId);

    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(userId);
    expect(component.ngOnInit).not.toHaveBeenCalled();
    expect(matDialogSpy.open).toHaveBeenCalledWith(AppErrorDialogComponent, {
      data: undefined,
      disableClose: true,
    });
  });

  it('should call makeAdmin and refresh users on makeAdmin', () => {
    const userId = 1;

    userServiceMock.makeAdmin.and.returnValue(of({message: "success"}));

    spyOn(component, 'ngOnInit');

    component.makeAdmin(userId);

    expect(userServiceMock.makeAdmin).toHaveBeenCalledWith(userId);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should handle error when makeAdmin fails', () => {
    const userId = 1;
    const errorMessage = 'Error occurred while making user admin';
    userServiceMock.makeAdmin.and.returnValue(throwError({ error: errorMessage }));

    spyOn(component, 'ngOnInit');

    component.makeAdmin(userId);

    expect(userServiceMock.makeAdmin).toHaveBeenCalledWith(userId);
    expect(component.ngOnInit).not.toHaveBeenCalled();
    expect(matDialogSpy.open).toHaveBeenCalledWith(AppErrorDialogComponent, {
      data: undefined,
      disableClose: true,
    });
  });
});

