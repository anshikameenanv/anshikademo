import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddDealerDialogComponent } from 'src/app/add-dealer-dialog/add-dealer-dialog.component';
import { DealerService } from 'src/app/dealer.service';

@Component({
  selector: 'app-dealrship',
  templateUrl: './dealrship.component.html',
  styleUrls: ['./dealrship.component.scss']
})
export class DealrshipComponent implements OnInit {
  dealersData: any;
  //displayedColumns: string[] = ['serialNumber', 'Name', 'Amount', 'carModel', 'carBrand', 'carColor', 'carPrice', 'edit'];
  displayedColumns: string[] = ['serialNumber', 'name','amountCars', 'totalBudget', 'remainingBudget', 'edit'];
  //displayedColumns: string[] = ['id', 'name', 'totalBudget', 'remainingBudget', 'owner', 'location'  ,'edit'];
  dataSource!: MatTableDataSource<any>;
  showDiv: boolean=false;
  selectedDealerId!: any;

  constructor(private dialog: MatDialog,private router: Router,private http: HttpClient,private dealersService:DealerService) {}
  ngOnInit(): void {
  //this.loadDealers();
  this.dealersService.getDealers().subscribe((data) => {
    
    this.dealersData = data;
          this.dataSource = new MatTableDataSource(this.dealersData);
  });
    // Replace this with the actual JSON data
  
 
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getSerialNumber(index: number): number {
    return index + 1;
  }
  editItem(dealerId: number): void {
    // Implement the logic to edit the item with the given ID
    console.log(`Edit item with ID: ${dealerId}`);
  }

  onAddDealer(): void {
    const dialogRef = this.dialog.open(AddDealerDialogComponent);
    dialogRef.componentInstance.dealerAdded.subscribe(() => {
      // Handle the event, e.g., update the table
      this.loadDealers();
    });
   
  }
  
 
  loadDealers(): void {
    this.dealersService.getDealers().subscribe((data) => {
      this.dealersData = data;
      this.dataSource =this.dealersData;
      
    });
  }

  editDealer(dealer: any): void {
    console.log('Edit clicked for:', dealer);
    // Implement your edit logic here
  }

  deleteDealer(id: number): void {
    console.log(id);
    this.dealersService.deleteDealer(id).subscribe(
      () => {
        this.dealersData = this.dealersData.filter((dealer: { id: number; }) => dealer.id !== id);
        this.dataSource =this.dealersData;
      },
      (error) => {
        console.error('Error deleting dealer:', error);
      }
    );
  }
  handleEvent(state: boolean): void {
   ;
    this.showDiv = state;
  }
 
    // Method to handle the view action
    onView(dealer: any): void {
      console.log(dealer);
      
      this.selectedDealerId = dealer;
      this.showDiv = true;
    
        
        
 
    }
    }

  