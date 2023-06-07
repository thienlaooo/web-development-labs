import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from "@angular/common/http";
import { MedicineDetailsComponent } from './medicine-details.component';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppRoutingModule} from "../app-routing.module";
import {MatDialogModule} from "@angular/material/dialog";
import {of} from "rxjs";
import {UserService} from "../services/user.service";
import {MedicineService} from "../services/medicine.service";

describe('MedicineDetailsComponent', () => {
  let component: MedicineDetailsComponent;
  let fixture: ComponentFixture<MedicineDetailsComponent>;
  let medicineServiceMock;
  let orderServiceMock;
  let mockMedicineData = {
    id: 1,
    name: "SomeName",
    price: 50,
    photoUrls: ["url"],
    quantity: 10,
    producer: "Producer",
    inDemand: true
  };

  beforeEach(async () => {
    medicineServiceMock = jasmine.createSpyObj('MedicineService', ['getMedicine']);
    medicineServiceMock.getMedicine.and.returnValue(of(mockMedicineData));
    await TestBed.configureTestingModule({
      declarations: [ MedicineDetailsComponent ],
      imports: [HttpClientModule, AppRoutingModule, MatDialogModule],
      providers: [
        {provide: MedicineService, useValue: medicineServiceMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
