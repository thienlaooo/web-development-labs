import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from "@angular/common/http";
import { MedicineSearchComponent } from './medicine-search.component';
import {MedicineService} from "../services/medicine.service";
import {AuthenticationService} from "../services/auth.service";
import {of} from "rxjs";

describe('MedicineSearchComponent', () => {
  let component: MedicineSearchComponent;
  let fixture: ComponentFixture<MedicineSearchComponent>;
  let medicineServiceMock: jasmine.SpyObj<MedicineService>;
  const mockMedicines = [{
    id: 1,
    name: "SomeName",
    price: 50,
    photoUrls: ["url"],
    quantity: 10,
    producer: "Producer",
    inDemand: true
  }, {
    id: 2,
    name: "SomeName2",
    price: 50,
    photoUrls: ["url"],
    quantity: 10,
    producer: "Producer2",
    inDemand: true
  }];
  const mockSearchResult = [{
    id: 1,
    name: "SomeName",
    price: 50,
    photoUrls: ["url"],
    quantity: 10,
    producer: "Producer",
    inDemand: true
  }];

  beforeEach(async () => {
    medicineServiceMock = jasmine.createSpyObj('MedicineService', ['getMedicines', 'searchMedicines']);
    medicineServiceMock.getMedicines.and.returnValue(of(mockMedicines));
    medicineServiceMock.searchMedicines.and.returnValue(of(mockSearchResult));

    await TestBed.configureTestingModule({
      declarations: [ MedicineSearchComponent ],
      imports: [HttpClientModule],
      providers: [
        { provide: MedicineService, useValue: medicineServiceMock },
        AuthenticationService,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch medicines on ngOnInit', () => {

    component.ngOnInit();

    expect(component.medicines).toEqual(mockMedicines);
    expect(medicineServiceMock.getMedicines).toHaveBeenCalled();
  });

  it('should trigger searchTerms subject when search is called', () => {
    const searchSpy = spyOn(component.searchTerms, 'next');

    const searchTerm = 'Medicine';

    component.search(searchTerm);

    expect(searchSpy).toHaveBeenCalledWith(searchTerm);
  });

  it('should trigger searchTerms subject and clear searchBox on onClick', () => {
    const searchSpy = spyOn(component.searchTerms, 'next');
    component.searchBox = { nativeElement: { value: 'Medicine' } };

    component.onClick();

    expect(searchSpy).toHaveBeenCalledWith(' ');
    expect(component.searchBox.nativeElement.value).toBeNull();
  });

});
