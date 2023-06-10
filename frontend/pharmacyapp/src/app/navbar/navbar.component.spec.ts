import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {HttpClientModule} from "@angular/common/http";
import { MedicineSearchComponent } from "../medicine-search/medicine-search.component";
import {AuthenticationService} from "../services/auth.service";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['']);

    await TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
        MedicineSearchComponent
      ],
      imports: [HttpClientModule],
      providers: [{ provide: AuthenticationService, useValue: authServiceMock }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with opened$ BehaviorSubject as false', () => {
    expect(component.opened$.value).toBeFalse();
  });

  it('should toggle opened$ BehaviorSubject when toggle() is called', () => {
    component.opened$.next(false);
    component.toggle();
    expect(component.opened$.value).toBeTrue();

    component.opened$.next(true);
    component.toggle();
    expect(component.opened$.value).toBeFalse();
  });
});
