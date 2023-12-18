import { Component, Input, NgZone, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DealerService } from '../dealer.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddCarDialogComponent } from '../add-car-dialog/add-car-dialog.component';

@Component({
  selector: 'app-dealership-detail',
  templateUrl: './dealership-detail.component.html',
  styleUrls: ['./dealership-detail.component.scss']
})
export class DealershipDetailComponent {


  filteredCars: any[] = []; // Add type based on your car model
  dealer: any; // Change the type based on your data structure
  
  

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private dealerService: DealerService // Inject your service
  ) {}
  @Input() dealerId: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dealerId'] && this.dealerId !== null  && !isNaN(this.dealerId)) {
   console.log(this.dealerId);
      console.log( typeof this.dealerId);
     
      this.route.params.subscribe((params) => {
        const dealerId =this.dealerId;
        console.log('Dealer ID:', dealerId);
        
        this.dealerService.getDealerById(dealerId).subscribe(
          (dealer: any) => {
           
            this.dealer = dealer;
            this.filteredCars = [...this.dealer.cars];
            console.log(dealer);
          },
          (error) => {
            console.error('Error fetching dealer details:', error);
          }
        );
      });
      console.log('Fetching data for dealerId:', this.dealerId);
    }
    else {
      console.error('Invalid dealerId:', this.dealerId);
    }
  }
  goBack(): void {
    // Implement navigation back logic (e.g., using Angular Router)
   
  }

 
  openAddCarDialog(): void {
    console.log(this.dealerId);
    const dialogRef = this.dialog.open(AddCarDialogComponent, {
      width: '400px', // Adjust the width as needed
      data:  this.dealerId ,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Handle the result from the dialog (new car data or cancellation)
      if (result) {
        // Perform logic to add the new car (e.g., send to a service)
        console.log('New Car Data:', result);
      } else {
        console.log('Add Car dialog was canceled.');
      }
    });
  }
  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filter Value:', filterValue);
    
    this.filteredCars = this.dealer.cars.filter(
      (car:any) => {
        const matchesFilter =
          car.brand.toLowerCase().includes(filterValue) ||
          car.model.toLowerCase().includes(filterValue) ||
          car.color.toLowerCase().includes(filterValue);
  
        console.log('Car:', car, 'Matches Filter:', matchesFilter);
        return matchesFilter;
      }
    );
  }
  
  editCar(car: any): void {
    // Implement edit functionality
    console.log('Edit car:', car);
  }

  deleteCar(car: any): void {
    // Implement delete functionality
    console.log('Delete car:', car);
  }
}