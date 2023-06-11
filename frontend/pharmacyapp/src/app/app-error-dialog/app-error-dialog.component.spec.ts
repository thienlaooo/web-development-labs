import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppErrorDialogComponent } from './app-error-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";

describe('AppErrorDialogComponent', () => {
  let component: AppErrorDialogComponent;
  let fixture: ComponentFixture<AppErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppErrorDialogComponent ],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
