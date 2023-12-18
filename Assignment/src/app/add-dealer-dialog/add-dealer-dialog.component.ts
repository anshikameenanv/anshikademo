import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DealerService } from '../dealer.service';

@Component({
  selector: 'app-add-dealer-dialog',
  templateUrl: './add-dealer-dialog.component.html',
  styleUrls: ['./add-dealer-dialog.component.scss']
})
export class AddDealerDialogComponent implements OnInit {

  // Define variables to store form data
  dealerName: string = '';
  location: string = '';
  totalBudget: string = '';
  ownerFirstName: string = '';
  ownerLastName: string = '';
  remainingBudget:string='';
  @Output() dealerAdded = new EventEmitter<void>();

  constructor(private dialogRef: MatDialogRef<AddDealerDialogComponent>, private dealersService: DealerService) {}
  ngOnInit(): void {

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    const newDealer = {
      name: this.dealerName,
      location: this.location,
      totalBudget: this.totalBudget,
      remainingBudget:this.totalBudget,
      owner: {
        firstName: this.ownerFirstName,
        lastName: this.ownerLastName,
      },
      cars: [], // You can add cars here if needed
    };

    this.dealersService.addDealer(newDealer).subscribe(
      (response) => {
        console.log('Dealer added successfully:', response);
        this.dialogRef.close();
        this.dealerAdded.emit(); // Emit the event
      },
      (error) => {
        console.error('Error adding dealer:', error);
      }
    );
  }
}
