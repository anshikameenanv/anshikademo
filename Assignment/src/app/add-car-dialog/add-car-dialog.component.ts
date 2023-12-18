// add-car-dialog.component.ts
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DealerService } from '../dealer.service';

@Component({
  selector: 'app-add-car-dialog',
  templateUrl: './add-car-dialog.component.html',
  styleUrls: ['./add-car-dialog.component.scss'],
})
export class AddCarDialogComponent {
  brand: string = '';
  model: string = '';
  color: string = '';
  price: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddCarDialogComponent>,
    private dealerService: DealerService,
    @Inject(MAT_DIALOG_DATA) public data: { dealerId: number }
  ) {}
  @Output() carAdded = new EventEmitter<void>();
  onSaveClick(): void {
    // Validate form fields before adding the car
    if (this.brand && this.model && this.color && this.price) {
      // Construct the new car object
      const newCar = {
        brand: this.brand,
        model: this.model,
        color: this.color,
        price: this.price,
      };

      // Emit the carAdded event
      this.carAdded.emit();
    
      const dealerId = this.data;
      console.log(dealerId);
      this.dealerService.addCar(dealerId, newCar).subscribe((response) => {
        console.log('Car added successfully:', response);
        this.dialogRef.close(response); // Close the dialog on success
      });
      // Close the dialog
     
    } else {
      // Handle validation error, e.g., show an error message
      console.error('All fields are mandatory.');
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
