import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMedicinesComponent } from './all-medicines.component';
import {MedicineListComponent} from "../medicine-list/medicine-list.component";
import {HttpClientModule} from "@angular/common/http";

describe('AllMedicinesComponent', () => {
  let component: AllMedicinesComponent;
  let fixture: ComponentFixture<AllMedicinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AllMedicinesComponent,
        MedicineListComponent
      ],
      imports: [HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMedicinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
