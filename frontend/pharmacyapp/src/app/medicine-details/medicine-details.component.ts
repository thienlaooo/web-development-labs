import {Component, OnInit} from '@angular/core';
import {MedicineService} from "../services/medicine.service";
import {Medicine} from "../models";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../services/order.service";

@Component({
  selector: 'app-medicine-details',
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.scss']
})
export class MedicineDetailsComponent implements OnInit {
  medicine: Medicine;
  id: string;

  constructor(
    private medicineService: MedicineService,
    private route: ActivatedRoute,
    public orderService: OrderService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getMedicine();
    });
  }

  getMedicine(): void {
    const id = parseInt(this.id!, 10);
    this.medicineService.getMedicine(id)
      .subscribe(medicine => this.medicine = medicine);
  }
}
