import {Component, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from "rxjs";
import {Medicine} from "../models";
import {MedicineService} from "../services/medicine.service";
import {AuthenticationService} from "../services/auth.service";

@Component({
  selector: 'app-medicine-search',
  templateUrl: './medicine-search.component.html',
  styleUrls: ['./medicine-search.component.scss']
})
export class MedicineSearchComponent implements OnInit{
  @ViewChild('searchBox') searchBox: any;
  medicines: Medicine[];
  searchMedicines$!: Observable<Medicine[]>;

  constructor(private medicineService: MedicineService) { }


  getMedicines(): void {
    this.medicineService.getMedicines()
      .subscribe(medicines => this.medicines = medicines);
  }

  private searchTerms = new Subject<string>();


  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.getMedicines();
    this.searchMedicines$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.medicineService.searchMedicines(term, this.medicines)),
    );
  }

  onClick(): void {
    this.searchTerms.next(' ');
    this.searchBox.nativeElement.value = null;
  }
}
