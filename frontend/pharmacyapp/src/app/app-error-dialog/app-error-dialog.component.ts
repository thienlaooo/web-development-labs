import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  template: `
    <h1 mat-dialog-title>Error</h1>
    <div mat-dialog-content>
      <p>{{ errorMessage }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Close</button>
    </div>
  `,
})
export class AppErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public errorMessage: string) {}
}
