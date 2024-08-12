import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DestinationService } from 'src/app/services/destination.service';
import { FilterrouteService } from 'src/app/services/filterroute.service';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  subscribeForm!: FormGroup;
  currentYear: number;
  isLoading: boolean = false;
  travelersCount: { adult: number; children: number; infantOnSeat: number, infantOnlap: number } = { adult: 1, children: 0, infantOnSeat: 0, infantOnlap: 0 };
  dummyData: any;
  destinations: any;
  hideFooter:boolean=false;

  constructor(private formBuilder: FormBuilder,private snackBarService:SnackbarService, private router: Router, private snackBar: MatSnackBar, private flightService: FlightsearchService, private viewportScroller: ViewportScroller
    ,private filterRoute: FilterrouteService,private getflag:DestinationService,
    private data: DataService) {
    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.dummyData = this.data.dummyData
    this.destinations = this.data.destinationsData
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.getflag.getSelectedDestination().subscribe(data => {
      this.hideFooter=data
    });
  
  }

  navigateabout() {
    this.router.navigate(['/about']);
  }

  // onSubmit() {
  //   if (this.subscribeForm.valid) {
  //     this.showSnackbar("you will receive email notification on regular interval");
  //     this.router.navigate(['/newsLetter']);
  //   }
  //   else {
  //     this.showSnackbar('Please enter valid email');
  //     this.snackBarService.showSnackBar('Please enter valid email', 'custom-snackbar-error');
  //   }
  // }
  selectDestination(destination: any) {
    this.isLoading = true;
    const selectedTabIndex = 0;
    const flightMultiCitySearchDetail: any = [];
    let origin: any;
    let leavingFrom: any;
    origin = sessionStorage.getItem('airport');
    const airport = JSON.parse(origin);
    if (airport && airport.iataCode != 'IDR') {
      leavingFrom = {
        cityCode: airport.cityCode,
        cityName: this.formatCityName(airport.cityName),
        name: this.formatCityName(airport.name),
        countryCode: airport.countryCode,
        iataCode: airport.iataCode
      }
    } else {

      leavingFrom = this.dummyData;
    }
    const formData = this.filterRoute.getSearchFormData(destination.iataCode, leavingFrom.iataCode);
    const todayISO = new Date();
    const myform = {
      leavingFrom: leavingFrom,
      goingTo: destination,
      directFlights: false,
      dates: todayISO,
      roundDatesDeparture: todayISO,
      roundDatesGoingTo: todayISO,
      travelers: 1,
      multiCityFlights: [
        {
          leavingFrom: "",
          goingTo: "",
          departDate: todayISO
        },
        {
          leavingFrom: "",
          goingTo: "",
          departDate: todayISO
        }
      ],
      selectedTravelClass: "ECONOMY"
    };

    this.flightService.getFlightSearchData(formData).subscribe(
      (response: any) => {
        if (response && response.data) {
          let filteredOffers = response.data;
          this.isLoading = false;
          this.flightService.setSearchData(filteredOffers, myform, selectedTabIndex, flightMultiCitySearchDetail, this.travelersCount);
          this.viewportScroller.scrollToPosition([0, 0]);
          this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
          this.router.navigate(['/filter']);
        }
        else {
          this.snackBarService.showSnackBar(response.message, 'custom-snackbar-error');
          this.isLoading = false;
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.snackBarService.showSnackBar('Internal server error', 'custom-snackbar-error');
        console.error('Error fetching flight data:', error);
      }
    );
  }
  formatCityName(cityName: string): string {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  }

  formatDate(selectedDate: any) {
  
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
}
