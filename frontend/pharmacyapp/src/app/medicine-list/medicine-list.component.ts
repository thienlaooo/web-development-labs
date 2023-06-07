import {Component, NgModule, OnInit} from '@angular/core';
import { Medicine } from "../models";
import { MedicineService } from "../services/medicine.service";

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss']
})
export class MedicineListComponent implements OnInit{
  medicines: Medicine[] = [];

  constructor(private medicineService: MedicineService) { }

  ngOnInit() {
    this.getMedicines();
  }

  getMedicines(): void {
    this.medicineService.getMedicines()
      .subscribe(medicines => this.medicines = medicines);
  }
}
