import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FilterrouteService } from 'src/app/services/filterroute.service';
import { FlightsearchService } from 'src/app/services/flightsearch.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-top-destination',
  templateUrl: './top-destination.component.html',
  styleUrls: ['./top-destination.component.scss']
})
export class TopDestinationComponent {
  destinations: { name: string, imagePath: string,data:any }[] = [];
  isLoading:boolean=false;
  travelersCount: { adult: number; children: number; infantOnSeat: number, infantOnlap: number } = { adult: 1, children: 0, infantOnSeat: 0, infantOnlap: 0 };
  imagePaths: string[] = [
    'assets/images/tdImg1.png',
    'assets/images/tdImg2.png',
    'assets/images/tdImg3.png',
    'assets/images/tdImg4.png',
    'assets/images/tdImg1.png',
    'assets/images/tdImg2.png'
  ];
  dummyData :any;
  destinationsData :any;
  dislayDestination: any = [];
  currentIndex: number = 0;

constructor(private filterRoute:FilterrouteService,private snackBarService :SnackbarService,
  private flightService:FlightsearchService,private router:Router,private destination:DataService,private snackBar:MatSnackBar) {
 
  this.dummyData=this.destination.dummyData;
  this.destinationsData =this.destination.destinationsData;
  this.getTopMostDestination();
  
}
topUsdestinationprev() {
  if (this.currentIndex > 0) {
    this.currentIndex -= 3;
    this.dislayDestination = this.destinations.slice(this.currentIndex, this.currentIndex + 3);

  }
}
topUsdestinationnext() {
  if (this.currentIndex + 3 < this.destinations.length) {
    this.currentIndex += 3;
    this.dislayDestination = this.destinations.slice(this.currentIndex, this.currentIndex + 3);
  }
}
getTopMostDestination() {
  let country = ['New York', 'Las Vegas', 'Chicago', 'Los Angeles', 'Miami', 'Orlando'];

  for (let index = 0; index < country.length; index++) {
    this.destinations.push({ name: country[index], imagePath: this.imagePaths[index],data:this.destinationsData[index] });
    this.dislayDestination = this.destinations.slice(0, 3);
  }
}
selectDestination(destination: any) {
  this.isLoading=true;
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
  const formData = this.filterRoute.getSearchFormData(destination.data.iataCode, leavingFrom.iataCode);
  const todayISO = new Date();
  const myform = {
    leavingFrom: leavingFrom,
    goingTo: destination.data,
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
        // const formData = myForm;
        let filteredOffers = response.data;
        this.isLoading=false;

        this.flightService.setSearchData(filteredOffers, myform, selectedTabIndex, flightMultiCitySearchDetail, this.travelersCount);
        this.router.navigate(['/filter']);


        this.snackBarService.showSnackBar(response.message, 'custom-snackbar-success');
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
scrollToTop() {
  const element = document.getElementById('top');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
}
const formatDateToISO = (date: Date) => {
return date.toISOString();
};
