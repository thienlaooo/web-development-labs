import {Component, OnInit} from '@angular/core';
import {MedicineService} from "../services/medicine.service";
import {Medicine} from "../models";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../services/order.service";
import {AppErrorDialogComponent} from "../app-error-dialog/app-error-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
    public orderService: OrderService,
    private router: Router,
    private dialog: MatDialog) {
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

  addMedicineToOrder(id: number): void {
    this.orderService.addMedicineToOrder(id)
      .subscribe(
        _ => {this.router.navigate(['/cart'])},
        error => {
          this.dialog.open(AppErrorDialogComponent, {
            data: error.error['message'],
            disableClose: true,
        });
        }
      );
  }
}
